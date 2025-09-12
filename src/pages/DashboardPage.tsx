import { SectionCards } from "@/components/shared/section-cards";
import { ChartAreaInteractive } from "@/components/shared/chart-area-interactive";
import { Button } from "@/components/ui/button";
import { useDatabase } from "tauri-react-sqlite";

import {
  bookings,
  cars,
  users,
  clients,
  maintenance,
  payments,
} from "../db/schema";
import { faker } from "@faker-js/faker";

interface GenerateOptions {
  usersCount?: number;
  clientsCount?: number;
  carsCount?: number;
  bookingsCount?: number;
  maintenancePerCar?: number;
}

function DashboardPage() {
  const { db } = useDatabase();
  const generateTestData = async (options: GenerateOptions = {}) => {
    const {
      usersCount = 2,
      clientsCount = 1000,
      carsCount = 1000,
      bookingsCount = 3000,
      maintenancePerCar = 3,
    } = options;
    if (db) {
      console.log("🚀 Starting car rental test data generation...");

      // Clear existing data in correct order (due to foreign keys)
      console.log("🧹 Clearing existing data...");
      // await db.delete(payments);
      // await db.delete(bookings);
      // await db.delete(maintenance);
      // await db.delete(cars);
      // await db.delete(clients);
      // await db.delete(users);

      // Generate users (admins)
      console.log("👥 Generating admin users...");
      const userData = Array.from({ length: usersCount }, (_, i) => ({
        username: faker.internet.username(),
        email: faker.internet.email(),
        passwordHash: faker.internet.password(), // In real app, use proper hashing
      }));
      const insertedUsers = await db.insert(users).values(userData).returning();
      console.log(`✅ Generated ${insertedUsers.length} admin users`);

      // Generate clients
      console.log("👥 Generating clients...");
      const clientData = Array.from({ length: clientsCount }, (_, i) => ({
        username: faker.internet.username(),
        email: faker.internet.email(),
        role: faker.helpers.arrayElement(["client", "admin"] as const),
        phone: faker.phone.number(),
        fullName: faker.person.fullName(),
        driverLicense: faker.string.alphanumeric(10).toUpperCase(),
        isActive: faker.datatype.boolean(0.9), // 90% active
        createdAt: faker.date.past({ years: 2 }),
      }));

      const insertedClients = await db
        .insert(clients)
        .values(clientData)
        .returning();
      console.log(`✅ Generated ${insertedClients.length} clients`);

      // Generate cars
      console.log("🚗 Generating cars...");
      const carBrands = [
        "Toyota",
        "Honda",
        "Ford",
        "BMW",
        "Mercedes",
        "Audi",
        "Volkswagen",
        "Hyundai",
        "Kia",
        "Nissan",
      ];
      const carModels = {
        Toyota: ["Camry", "Corolla", "RAV4", "Prius", "Highlander"],
        Honda: ["Civic", "Accord", "CR-V", "Pilot", "HR-V"],
        Ford: ["Focus", "Fiesta", "Mustang", "Explorer", "Edge"],
        BMW: ["3 Series", "5 Series", "X3", "X5", "X1"],
        Mercedes: ["C-Class", "E-Class", "S-Class", "GLC", "GLE"],
        Audi: ["A3", "A4", "A6", "Q5", "Q7"],
        Volkswagen: ["Golf", "Passat", "Tiguan", "Jetta", "Arteon"],
        Hyundai: ["Elantra", "Sonata", "Tucson", "Santa Fe", "Kona"],
        Kia: ["Rio", "Forte", "Sorento", "Sportage", "Telluride"],
        Nissan: ["Altima", "Sentra", "Rogue", "Murano", "Pathfinder"],
      };

      const colors = [
        "Black",
        "White",
        "Silver",
        "Gray",
        "Red",
        "Blue",
        "Green",
        "Yellow",
      ];
      const locations = [
        "Downtown",
        "Airport",
        "City Center",
        "Shopping Mall",
        "Train Station",
      ];

      const carData = Array.from({ length: carsCount }, (_, i) => {
        const brand = faker.helpers.arrayElement(carBrands);
        const model = faker.helpers.arrayElement(
          carModels[brand as keyof typeof carModels]
        );
        const category = faker.helpers.arrayElement([
          "economy",
          "comfort",
          "business",
        ] as const);

        // Different pricing based on category
        const dailyPrice =
          category === "economy"
            ? faker.number.float({ min: 30, max: 60, fractionDigits: 2 })
            : category === "comfort"
            ? faker.number.float({ min: 60, max: 120, fractionDigits: 2 })
            : faker.number.float({ min: 120, max: 300, fractionDigits: 2 });

        return {
          licensePlate: generateLicensePlate(),
          brand,
          model,
          year: faker.number.int({ min: 2018, max: 2024 }),
          color: faker.helpers.arrayElement(colors),
          category,
          dailyPrice,
          isAvailable: faker.datatype.boolean(0.8), // 80% available
          currentMileage: faker.number.float({
            min: 5000,
            max: 80000,
            fractionDigits: 0,
          }),
          status: faker.helpers.arrayElement([
            "available",
            "rented",
            "maintenance",
          ] as const),
          location: faker.helpers.arrayElement(locations),
          createdAt: faker.date.past({ years: 1 }),
        };
      });

      const insertedCars = await db.insert(cars).values(carData).returning();
      console.log(`✅ Generated ${insertedCars.length} cars`);

      // Generate maintenance records
      console.log("🔧 Generating maintenance records...");
      const maintenanceData = insertedCars.flatMap((car) =>
        Array.from({ length: maintenancePerCar }, () => ({
          carId: car.id,
          description: faker.helpers.arrayElement([
            "Oil change and filter replacement",
            "Brake system inspection and service",
            "Tire rotation and balancing",
            "Engine diagnostics and tune-up",
            "Transmission fluid change",
            "Air conditioning service",
            "Suspension system check",
            "Battery replacement",
          ]),
          cost: faker.number.float({ min: 50, max: 500, fractionDigits: 2 }),
          date: faker.date.past({ years: 1 }),
          mileage: faker.number.float({
            min: Math.max(0, car.currentMileage - 10000),
            max: car.currentMileage,
            fractionDigits: 0,
          }),
          createdAt: faker.date.past({ years: 1 }),
        }))
      );

      const insertedMaintenance = await db
        .insert(maintenance)
        .values(maintenanceData)
        .returning();
      console.log(
        `✅ Generated ${insertedMaintenance.length} maintenance records`
      );

      // Generate bookings
      console.log("📅 Generating bookings...");
      const bookingData = Array.from({ length: bookingsCount }, (_, i) => {
        const client = faker.helpers.arrayElement(insertedClients);
        const car = faker.helpers.arrayElement(insertedCars);

        const startDate = faker.date.past({ years: 1 });
        const endDate = new Date(
          startDate.getTime() +
            faker.number.int({ min: 1, max: 14 }) * 24 * 60 * 60 * 1000
        );
        const totalDays = Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        const totalPrice = totalDays * car.dailyPrice;

        const status = faker.helpers.arrayElement([
          "pending",
          "confirmed",
          "active",
          "completed",
          "cancelled",
        ] as const);
        const paymentStatus =
          status === "completed" || status === "active"
            ? ("paid" as const)
            : status === "cancelled"
            ? faker.helpers.arrayElement(["pending", "refunded"] as const)
            : ("pending" as const);

        return {
          userId: client.id,
          carId: car.id,
          startDate,
          endDate,
          totalDays,
          totalPrice,
          status,
          pickupLocation: car.location,
          paymentStatus,
          createdAt: faker.date.past({ years: 1 }),
        };
      });

      const insertedBookings = await db
        .insert(bookings)
        .values(bookingData)
        .returning();
      console.log(`✅ Generated ${insertedBookings.length} bookings`);

      // Generate payments
      console.log("💳 Generating payments...");
      const paymentData = insertedBookings
        .filter(
          (booking) =>
            booking.paymentStatus === "paid" ||
            booking.paymentStatus === "refunded"
        )
        .map((booking) => {
          const user = faker.helpers.arrayElement(insertedUsers);

          return {
            bookingId: booking.id,
            userId: user.id,
            amount: booking.totalPrice,
            status: booking.paymentStatus,
            transactionId: `TXN${faker.string.numeric(10)}`,
            cardLastDigits: faker.string.numeric(4),
            paymentDate: faker.date.between({
              from: booking.createdAt,
              to: new Date(),
            }),
            createdAt: booking.createdAt,
          };
        });

      const insertedPayments = await db
        .insert(payments)
        .values(paymentData as any)
        .returning();
      console.log(`✅ Generated ${insertedPayments.length} payments`);

      console.log("🎉 Car rental test data generation completed!");
      console.log("\n📊 Summary:");
      console.log(`   Admin Users: ${insertedUsers.length}`);
      console.log(`   Clients: ${insertedClients.length}`);
      console.log(`   Cars: ${insertedCars.length}`);
      console.log(`   Maintenance Records: ${insertedMaintenance.length}`);
      console.log(`   Bookings: ${insertedBookings.length}`);
      console.log(`   Payments: ${insertedPayments.length}`);
    }

    return;
  };

  function generateLicensePlate(): string {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";

    let plate = "";
    // Format: AA 1234 BB
    plate += letters.charAt(Math.floor(Math.random() * letters.length));
    plate += letters.charAt(Math.floor(Math.random() * letters.length));
    plate += " ";
    plate += numbers.charAt(Math.floor(Math.random() * numbers.length));
    plate += numbers.charAt(Math.floor(Math.random() * numbers.length));
    plate += numbers.charAt(Math.floor(Math.random() * numbers.length));
    plate += numbers.charAt(Math.floor(Math.random() * numbers.length));
    plate += " ";
    plate += letters.charAt(Math.floor(Math.random() * letters.length));
    plate += letters.charAt(Math.floor(Math.random() * letters.length));

    return plate;
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>
          {/* <DataTable data={data} /> */}
          <Button
            onClick={async () => {
              for (let i = 0; i < 35; i++) {
                await generateTestData();
              }
            }}
          >
            Generate data
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
