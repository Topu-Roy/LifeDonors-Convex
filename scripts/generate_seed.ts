import * as fs from "fs";
import * as path from "path";
import { bangladeshAdministrativeData } from "../constants/bangladeshAdministrativeAreas";

const names = [
  "Anisur Rahman",
  "Farhana Islam",
  "Kamrul Hassan",
  "Sharmin Akter",
  "Mizanur Chowdhury",
  "Tania Ahmed",
  "Asif Iqbal",
  "Sumaiya Khan",
  "Nasir Uddin",
  "Arifa Sultana",
  "Rafiqul Islam",
  "Nusrat Jahan",
  "Mahbubur Rahman",
  "Sadia Afrin",
  "Tanvir Ahmed",
  "Rina Begum",
  "Shafiqul Alam",
  "Jesmin Akter",
  "Monir Hossain",
  "Salma Khatun",
  "Zahid Hasan",
  "Fatema Tuz Zohra",
  "Saiful Islam",
  "Nazma Begum",
  "Abul Kashem",
  "Rokeya Sultana",
  "Mostafa Kamal",
  "Bilkis Banu",
  "Azizul Haque",
  "Sabina Yasmin",
  "Humayun Kabir",
  "Kohinoor Akter",
  "Rezaul Karim",
  "Shahnaz Parvin",
  "Aminul Islam",
  "Ferdousi Begum",
  "Habibur Rahman",
  "Nilufar Yasmin",
  "Jahangir Alam",
  "Shamima Nasrin",
  "Golam Mostafa",
  "Khadija Begum",
  "Anwar Hossain",
  "Meherun Nesa",
  "Shahadat Hossain",
]; // 45

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
]; // 37

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const urgencies = ["Low", "Medium", "High", "Critical"];
const causes = ["Operation", "Delivery", "Accident", "Cancer Treatment", "Thalassemia", "Other"];
const genders = ["Male", "Female", "Other"];

const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

for (const div of bangladeshAdministrativeData) {
  const divisionDir = path.join("assets", div.division);
  if (!fs.existsSync(divisionDir)) {
    fs.mkdirSync(divisionDir, { recursive: true });
  }

  for (const dist of div.districts) {
    const districtFile = path.join(divisionDir, `${dist.district.replace(/ /g, "_")}.ts`);
    let content = `export const seedData = [\n`;

    for (const sub of dist.subDistricts) {
      const numRequests = Math.floor(Math.random() * 6) + 5; // 5 to 10
      for (let i = 0; i < numRequests; i++) {
        content += `  {\n`;
        content += `    patientName: "${getRandom(names)}",\n`;
        content += `    hospitalName: "${getRandom(hospitals)}",\n`;
        content += `    hospitalLocation: "Ward ${Math.floor(Math.random() * 10) + 1}, ${getRandom(hospitals)} area",\n`;
        content += `    bloodTypeNeeded: "${getRandom(bloodTypes)}",\n`;
        content += `    urgency: "${getRandom(urgencies)}",\n`;
        content += `    contactNumber: "01${Math.floor(Math.random() * 900000000 + 100000000)}",\n`;
        content += `    phoneNumber: "01700000000",\n`;
        content += `    numberOfBags: ${Math.floor(Math.random() * 4) + 1},\n`;
        content += `    cause: "${getRandom(causes)}",\n`;
        content += `    patientAge: ${Math.floor(Math.random() * 60) + 5},\n`;
        content += `    patientGender: "${getRandom(genders)}",\n`;
        content += `    division: "${div.division}",\n`;
        content += `    district: "${dist.district}",\n`;
        content += `    subDistrict: "${sub}",\n`;
        content += `    status: "Open",\n`;
        content += `    isSeed: true,\n`;
        content += `  },\n`;
      }
    }
    content += `];\n`;
    fs.writeFileSync(districtFile, content);
  }
}
console.log("Seed assets generated successfully.");
