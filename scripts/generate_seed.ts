import * as fs from "fs";
import * as path from "path";
import { bangladeshAdministrativeData } from "../constants/bangladeshAdministrativeAreas";

const namesAndGender = [
  { name: "Anisur Rahman", gender: "Male" },
  { name: "Farhana Islam", gender: "Female" },
  { name: "Kamrul Hassan", gender: "Male" },
  { name: "Sharmin Akter", gender: "Female" },
  { name: "Mizanur Chowdhury", gender: "Male" },
  { name: "Tania Ahmed", gender: "Female" },
  { name: "Asif Iqbal", gender: "Male" },
  { name: "Sumaiya Khan", gender: "Female" },
  { name: "Nasir Uddin", gender: "Male" },
  { name: "Arifa Sultana", gender: "Female" },
  { name: "Rafiqul Islam", gender: "Male" },
  { name: "Nusrat Jahan", gender: "Female" },
  { name: "Mahbubur Rahman", gender: "Male" },
  { name: "Sadia Afrin", gender: "Female" },
  { name: "Tanvir Ahmed", gender: "Male" },
  { name: "Rina Begum", gender: "Female" },
  { name: "Shafiqul Alam", gender: "Male" },
  { name: "Jesmin Akter", gender: "Female" },
  { name: "Monir Hossain", gender: "Male" },
  { name: "Salma Khatun", gender: "Female" },
  { name: "Zahid Hasan", gender: "Male" },
  { name: "Fatema Tuz Zohra", gender: "Female" },
  { name: "Saiful Islam", gender: "Male" },
  { name: "Nazma Begum", gender: "Female" },
  { name: "Abul Kashem", gender: "Male" },
  { name: "Rokeya Sultana", gender: "Female" },
  { name: "Mostafa Kamal", gender: "Male" },
  { name: "Bilkis Banu", gender: "Female" },
  { name: "Azizul Haque", gender: "Male" },
  { name: "Sabina Yasmin", gender: "Female" },
  { name: "Humayun Kabir", gender: "Male" },
  { name: "Kohinoor Akter", gender: "Female" },
  { name: "Rezaul Karim", gender: "Male" },
  { name: "Shahnaz Parvin", gender: "Female" },
  { name: "Aminul Islam", gender: "Male" },
  { name: "Ferdousi Begum", gender: "Female" },
  { name: "Habibur Rahman", gender: "Male" },
  { name: "Nilufar Yasmin", gender: "Female" },
  { name: "Jahangir Alam", gender: "Male" },
  { name: "Shamima Nasrin", gender: "Female" },
  { name: "Golam Mostafa", gender: "Male" },
  { name: "Khadija Begum", gender: "Female" },
  { name: "Anwar Hossain", gender: "Male" },
  { name: "Meherun Nesa", gender: "Female" },
  { name: "Shahadat Hossain", gender: "Male" },
];

const hospitals = [
  "Apollo Hospital",
  "United Hospital",
  "Square Hospital",
  "Labaid Hospital",
  "Dhaka Medical College Hospital",
  "Bangabandhu Sheikh Mujib Medical University",
  "Ibn Sina Hospital",
  "Central Hospital",
  "Evercare Hospital",
  "Popular Diagnostic Centre",
  "BIRDEM General Hospital",
  "Kurmitola General Hospital",
  "Mugda Medical College Hospital",
  "Sir Salimullah Medical College Hospital",
  "Shaheed Suhrawardy Medical College Hospital",
  "National Institute of Cardiovascular Diseases",
  "National Institute of Cancer Research & Hospital",
  "Holy Family Red Crescent Medical College Hospital",
  "Delta Hospital",
  "Green Life Medical College Hospital",
  "Chittagong Medical College Hospital",
  "Rajshahi Medical College Hospital",
  "Sylhet MAG Osmani Medical College Hospital",
  "Khulna Medical College Hospital",
  "Sher-e-Bangla Medical College Hospital",
  "Rangpur Medical College Hospital",
  "Mymensingh Medical College Hospital",
  "Comilla Medical College Hospital",
  "Enam Medical College Hospital",
  "Ad-din Medical College Hospital",
  "Anwer Khan Modern Medical College Hospital",
  "Bangladesh Specialized Hospital",
  "BRB Hospital",
  "MH Samorita Hospital",
  "Monno Medical College Hospital",
  "Marks Medical College Hospital",
  "Zainul Haque Sikder Women's Medical College & Hospital",
];

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const urgencies = ["Low", "Medium", "High", "Critical"];
const causes = ["Operation", "Delivery", "Accident", "Other"];

const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
const getRandomNameAndAge = (arr: { name: string; gender: string }[]) =>
  arr[Math.floor(Math.random() * arr.length)];

for (const div of bangladeshAdministrativeData) {
  const divisionDir = path.join("assets", "seed", div.division);
  if (!fs.existsSync(divisionDir)) {
    fs.mkdirSync(divisionDir, { recursive: true });
  }

  for (const dist of div.districts) {
    const districtFile = path.join(divisionDir, `${dist.district.replace(/ /g, "_")}.ts`);
    let content = `export const seedData = [\n`;

    for (const sub of dist.subDistricts) {
      const numRequests = Math.floor(Math.random() * 6) + 5; // 5 to 10
      for (let i = 0; i < numRequests; i++) {
        const { name, gender } = getRandomNameAndAge(namesAndGender);

        content += `  {
            patientName: "${name}",
            hospitalName: "${getRandom(hospitals)}",
            hospitalLocation: "Ward ${Math.floor(Math.random() * 10) + 1}, ${getRandom(hospitals)} area",
            bloodTypeNeeded: "${getRandom(bloodTypes)}",
            urgency: "${getRandom(urgencies)}",
            contactNumber: "01700000000",
            phoneNumber: "01700000000",
            numberOfBags: ${Math.floor(Math.random() * 4) + 1},
            cause: "${gender === "Male" ? getRandom(causes.filter(c => c !== "Delivery")) : getRandom(causes)}",
            patientAge: ${Math.floor(Math.random() * 60) + 5},
            patientGender: "${gender}",
            division: "${div.division}",
            district: "${dist.district}",
            subDistrict: "${sub}",
            status: "Open",
            isSeed: true,
          },\n`;

        // content += `  {\n`;
        // content += `    patientName: "${name}",\n`;
        // content += `    hospitalName: "${getRandom(hospitals)}",\n`;
        // content += `    hospitalLocation: "Ward ${Math.floor(Math.random() * 10) + 1}, ${getRandom(hospitals)} area",\n`;
        // content += `    bloodTypeNeeded: "${getRandom(bloodTypes)}",\n`;
        // content += `    urgency: "${getRandom(urgencies)}",\n`;
        // content += `    contactNumber: ""01700000000"",\n`;
        // content += `    phoneNumber: "01700000000",\n`;
        // content += `    numberOfBags: ${Math.floor(Math.random() * 4) + 1},\n`;
        // content += `    cause: "${gender === "Male" ? getRandom(causes.filter(c => c !== "Delivery")) : getRandom(causes)}",\n`;
        // content += `    patientAge: ${Math.floor(Math.random() * 60) + 5},\n`;
        // content += `    patientGender: "${gender}",\n`;
        // content += `    division: "${div.division}",\n`;
        // content += `    district: "${dist.district}",\n`;
        // content += `    subDistrict: "${sub}",\n`;
        // content += `    status: "Open",\n`;
        // content += `    isSeed: true,\n`;
        // content += `  },\n`;
      }
    }
    content += `];\n`;
    fs.writeFileSync(districtFile, content);
  }
}
console.log("Seed assets generated successfully.");
