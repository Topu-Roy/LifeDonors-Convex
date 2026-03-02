export type DistrictsAndSubDistrictsType = Array<{
  division: string;
  districts: {
    district: string;
    subDistricts: string[];
  }[];
}>;

export const bangladeshAdministrativeData: DistrictsAndSubDistrictsType = [
  {
    division: "Barisal",
    districts: [
      {
        district: "Barguna",
        subDistricts: [
          "Amtali",
          "Bamna",
          "Barguna Sadar",
          "Betagi",
          "Patharghata",
          "Taltali",
        ],
      },
      {
        district: "Barisal",
        subDistricts: [
          "Agailjhara",
          "Babuganj",
          "Bakerganj",
          "Banaripara",
          "Barisal Sadar",
          "Gournadi",
          "Hizla",
          "Mehendiganj",
          "Muladi",
          "Uzirpur",
        ],
      },
      {
        district: "Bhola",
        subDistricts: [
          "Bhola Sadar",
          "Burhanuddin",
          "Char Fasson",
          "Daulatkhan",
          "Lalmohan",
          "Manpura",
          "Tazumuddin",
        ],
      },
      {
        district: "Jhalokati",
        subDistricts: ["Jhalokati Sadar", "Kanthalia", "Nalchity", "Rajapur"],
      },
      {
        district: "Patuakhali",
        subDistricts: [
          "Bauphal",
          "Dashmina",
          "Dumki",
          "Galachipa",
          "Kalapara",
          "Mirzaganj",
          "Patuakhali Sadar",
          "Rangabali",
        ],
      },
      {
        district: "Pirojpur",
        subDistricts: [
          "Bhandaria",
          "Indurkani",
          "Kawkhali",
          "Mathbaria",
          "Nazirpur",
          "Nesarabad (Swarupkati)",
          "Pirojpur Sadar",
        ],
      },
    ],
  },
  {
    division: "Chittagong",
    districts: [
      {
        district: "Bandarban",
        subDistricts: [
          "Alikadam",
          "Bandarban Sadar",
          "Lama",
          "Naikhongchhari",
          "Rowangchhari",
          "Ruma",
          "Thanchi",
        ],
      },
      {
        district: "Brahmanbaria",
        subDistricts: [
          "Akhaura",
          "Ashuganj",
          "Bancharampur",
          "Brahmanbaria Sadar",
          "Kasba",
          "Nabinagar",
          "Nasirnagar",
          "Sarail",
          "Vijaynagar",
        ],
      },
      {
        district: "Chandpur",
        subDistricts: [
          "Chandpur Sadar",
          "Faridganj",
          "Haimchar",
          "Haziganj",
          "Kachua",
          "Matlab North",
          "Matlab South",
          "Shahrasti",
        ],
      },
      {
        district: "Chittagong",
        subDistricts: [
          "Anwara",
          "Banshkhali",
          "Boalkhali",
          "Chandanaish",
          "Fatikchhari",
          "Hathazari",
          "Karnaphuli",
          "Lohagara",
          "Mirsharai",
          "Patiya",
          "Rangunia",
          "Raozan",
          "Sandwip",
          "Satkania",
          "Sitakunda",
        ],
      },
      {
        district: "Comilla",
        subDistricts: [
          "Adarsha Sadar",
          "Barura",
          "Brahmanpara",
          "Burichang",
          "Chandina",
          "Chauddagram",
          "Daudkandi",
          "Debidwar",
          "Homna",
          "Laksam",
          "Lalmai",
          "Manoharganj",
          "Meghna",
          "Muradnagar",
          "Nangalkot",
          "Sadar South",
          "Titas",
        ],
      },
      {
        district: "Cox's Bazar",
        subDistricts: [
          "Chakaria",
          "Cox's Bazar Sadar",
          "Eidgaon",
          "Kutubdia",
          "Maheshkhali",
          "Pekua",
          "Ramu",
          "Teknaf",
          "Ukhia",
        ],
      },
      {
        district: "Feni",
        subDistricts: [
          "Chhagalnaiya",
          "Daganbhuiyan",
          "Feni Sadar",
          "Fulgazi",
          "Parshuram",
          "Sonagazi",
        ],
      },
      {
        district: "Khagrachhari",
        subDistricts: [
          "Dighinala",
          "Guimara",
          "Khagrachhari Sadar",
          "Lakshmichhari",
          "Mahalchhari",
          "Manikchhari",
          "Matiranga",
          "Panchhari",
          "Ramgarh",
        ],
      },
      {
        district: "Lakshmipur",
        subDistricts: [
          "Kamalnagar",
          "Lakshmipur Sadar",
          "Raipur",
          "Ramganj",
          "Ramgati",
        ],
      },
      {
        district: "Noakhali",
        subDistricts: [
          "Begumganj",
          "Chatkhil",
          "Companiganj",
          "Hatiya",
          "Kabirhat",
          "Noakhali Sadar",
          "Senbagh",
          "Sonaimuri",
          "Subarnachar",
        ],
      },
      {
        district: "Rangamati",
        subDistricts: [
          "Baghaichhari",
          "Barkal",
          "Belaichhari",
          "Juraichhari",
          "Kaptai",
          "Kawkhali",
          "Langadu",
          "Naniarchar",
          "Rajasthali",
          "Rangamati Sadar",
        ],
      },
    ],
  },
  {
    division: "Dhaka",
    districts: [
      {
        district: "Dhaka",
        subDistricts: ["Dhamrai", "Dohar", "Keraniganj", "Nawabganj", "Savar"],
      },
      {
        district: "Faridpur",
        subDistricts: [
          "Alfadanga",
          "Bhanga",
          "Boalmari",
          "Charbhadrasan",
          "Faridpur Sadar",
          "Madhukhali",
          "Nagarkanda",
          "Sadarpur",
          "Saltha",
        ],
      },
      {
        district: "Gazipur",
        subDistricts: [
          "Gazipur Sadar",
          "Kaliakair",
          "Kaliganj",
          "Kapasia",
          "Sreepur",
        ],
      },
      {
        district: "Gopalganj",
        subDistricts: [
          "Gopalganj Sadar",
          "Kashiani",
          "Kotalipara",
          "Muksudpur",
          "Tungipara",
        ],
      },
      {
        district: "Kishoreganj",
        subDistricts: [
          "Austagram",
          "Bajitpur",
          "Bhairab",
          "Hossainpur",
          "Itna",
          "Karimganj",
          "Katiadi",
          "Kishoreganj Sadar",
          "Kuliarchar",
          "Mithamain",
          "Nikli",
          "Pakundia",
          "Tarail",
        ],
      },
      {
        district: "Madaripur",
        subDistricts: ["Kalkini", "Madaripur Sadar", "Rajoir", "Shibchar"],
      },
      {
        district: "Manikganj",
        subDistricts: [
          "Daulatpur",
          "Ghior",
          "Harirampur",
          "Manikganj Sadar",
          "Saturia",
          "Shivalaya",
          "Singair",
        ],
      },
      {
        district: "Munshiganj",
        subDistricts: [
          "Gazaria",
          "Lohajang",
          "Munshiganj Sadar",
          "Sirajdikhan",
          "Sreenagar",
          "Tongibari",
        ],
      },
      {
        district: "Narayanganj",
        subDistricts: [
          "Araihazar",
          "Bandar",
          "Narayanganj Sadar",
          "Rupganj",
          "Sonargaon",
        ],
      },
      {
        district: "Narsingdi",
        subDistricts: [
          "Belabo",
          "Manohardi",
          "Narsingdi Sadar",
          "Palash",
          "Raipura",
          "Shibpur",
        ],
      },
      {
        district: "Rajbari",
        subDistricts: [
          "Baliakandi",
          "Goalandaghat",
          "Kalukhali",
          "Pangsha",
          "Rajbari Sadar",
        ],
      },
      {
        district: "Shariatpur",
        subDistricts: [
          "Bhedarganj",
          "Damudya",
          "Gosairhat",
          "Jajira",
          "Naria",
          "Shariatpur Sadar",
          "Zanjira",
        ],
      },
      {
        district: "Tangail",
        subDistricts: [
          "Basail",
          "Bhuapur",
          "Delduar",
          "Dhanbari",
          "Ghatail",
          "Gopalpur",
          "Kalihati",
          "Madhupur",
          "Mirzapur",
          "Nagarpur",
          "Sakhipur",
          "Tangail Sadar",
        ],
      },
    ],
  },
  {
    division: "Khulna",
    districts: [
      {
        district: "Bagerhat",
        subDistricts: [
          "Bagerhat Sadar",
          "Chitalmari",
          "Fakirhat",
          "Kachua",
          "Mollahat",
          "Mongla",
          "Morrelganj",
          "Rampal",
          "Sarankhola",
        ],
      },
      {
        district: "Chuadanga",
        subDistricts: [
          "Alamdanga",
          "Chuadanga Sadar",
          "Damurhuda",
          "Jibannagar",
        ],
      },
      {
        district: "Jessore",
        subDistricts: [
          "Abhaynagar",
          "Bagherpara",
          "Chaugachha",
          "Jhikargacha",
          "Keshabpur",
          "Jessore Sadar",
          "Manirampur",
          "Sharsha",
        ],
      },
      {
        district: "Jhenaidah",
        subDistricts: [
          "Harinakunda",
          "Jhenaidah Sadar",
          "Kaliganj",
          "Kotchandpur",
          "Maheshpur",
          "Shailkupa",
        ],
      },
      {
        district: "Khulna",
        subDistricts: [
          "Batiaghata",
          "Dacope",
          "Dighalia",
          "Dumuria",
          "Koyra",
          "Paikgacha",
          "Phultala",
          "Rupsha",
          "Terokhada",
        ],
      },
      {
        district: "Kushtia",
        subDistricts: [
          "Bheramara",
          "Daulatpur",
          "Khoksa",
          "Kumarkhali",
          "Kushtia Sadar",
          "Mirpur",
        ],
      },
      {
        district: "Magura",
        subDistricts: ["Magura Sadar", "Mohammadpur", "Shalikha", "Sreepur"],
      },
      {
        district: "Meherpur",
        subDistricts: ["Gangni", "Meherpur Sadar", "Mujibnagar"],
      },
      {
        district: "Narail",
        subDistricts: ["Kalia", "Lohagara", "Narail Sadar"],
      },
      {
        district: "Satkhira",
        subDistricts: [
          "Assasuni",
          "Debhata",
          "Kalaroa",
          "Kaliganj",
          "Satkhira Sadar",
          "Shyamnagar",
          "Tala",
        ],
      },
    ],
  },
  {
    division: "Mymensingh",
    districts: [
      {
        district: "Jamalpur",
        subDistricts: [
          "Baksiganj",
          "Dewanganj",
          "Islampur",
          "Jamalpur Sadar",
          "Madarganj",
          "Melandaha",
          "Sarishabari",
        ],
      },
      {
        district: "Mymensingh",
        subDistricts: [
          "Bhaluka",
          "Dhobaura",
          "Fulbaria",
          "Gaffargaon",
          "Gauripur",
          "Haluaghat",
          "Ishwarganj",
          "Mymensingh Sadar",
          "Muktagachha",
          "Nandail",
          "Phulpur",
          "Tarakanda",
          "Trishal",
        ],
      },
      {
        district: "Netrokona",
        subDistricts: [
          "Atpara",
          "Barhatta",
          "Durgapur",
          "Kalmakanda",
          "Kendua",
          "Khaliajuri",
          "Madan",
          "Mohanganj",
          "Netrokona Sadar",
          "Purbadhala",
        ],
      },
      {
        district: "Sherpur",
        subDistricts: [
          "Jhenaigati",
          "Nakla",
          "Nalitabari",
          "Sherpur Sadar",
          "Sreebardi",
        ],
      },
    ],
  },
  {
    division: "Rajshahi",
    districts: [
      {
        district: "Bogra",
        subDistricts: [
          "Adamdighi",
          "Bogra Sadar",
          "Dhunat",
          "Dupchanchia",
          "Gabtali",
          "Kahaloo",
          "Nandigram",
          "Sariakandi",
          "Shajahanpur",
          "Sherpur",
          "Shibganj",
          "Sonatola",
        ],
      },
      {
        district: "Chapainawabganj",
        subDistricts: [
          "Bholahat",
          "Chapainawabganj Sadar",
          "Gomastapur",
          "Nachole",
          "Shibganj",
        ],
      },
      {
        district: "Joypurhat",
        subDistricts: [
          "Akkelpur",
          "Bambal",
          "Joypurhat Sadar",
          "Kalai",
          "Khetlal",
          "Panchbibi",
        ],
      },
      {
        district: "Naogaon",
        subDistricts: [
          "Atrai",
          "Badalgachi",
          "Dhamoirhat",
          "Manda",
          "Mahadebpur",
          "Naogaon Sadar",
          "Niamatpur",
          "Patnitala",
          "Porsha",
          "Raninagar",
          "Sapahar",
        ],
      },
      {
        district: "Natore",
        subDistricts: [
          "Bagatipara",
          "Baraigram",
          "Gurudaspur",
          "Lalpur",
          "Natore Sadar",
          "Naldanga",
          "Singra",
        ],
      },
      {
        district: "Pabna",
        subDistricts: [
          "Atgharia",
          "Bera",
          "Bhangura",
          "Chatmohar",
          "Faridpur",
          "Ishwardi",
          "Pabna Sadar",
          "Santhia",
          "Sujanagar",
        ],
      },
      {
        district: "Rajshahi",
        subDistricts: [
          "Bagha",
          "Bagmara",
          "Charghat",
          "Durgapur",
          "Godagari",
          "Mohanpur",
          "Paba",
          "Puthia",
          "Tanore",
        ],
      },
      {
        district: "Sirajganj",
        subDistricts: [
          "Belkuchi",
          "Chauhali",
          "Kamarkhanda",
          "Kazipur",
          "Raiganj",
          "Shahjadpur",
          "Sirajganj Sadar",
          "Tarash",
          "Ullahpara",
        ],
      },
    ],
  },
  {
    division: "Rangpur",
    districts: [
      {
        district: "Dinajpur",
        subDistricts: [
          "Birampur",
          "Birganj",
          "Bochaganj",
          "Chirirbandar",
          "Dinajpur Sadar",
          "Ghoraghat",
          "Hakimpur",
          "Kaharole",
          "Khansama",
          "Nawabganj",
          "Parbatipur",
          "Phulbari",
        ],
      },
      {
        district: "Gaibandha",
        subDistricts: [
          "Fulchhari",
          "Gaibandha Sadar",
          "Gobindaganj",
          "Palashbari",
          "Sadullapur",
          "Saghata",
          "Sundarganj",
        ],
      },
      {
        district: "Kurigram",
        subDistricts: [
          "Bhurungamari",
          "Char Rajibpur",
          "Chilmari",
          "Kurigram Sadar",
          "Nageshwari",
          "Phulbari",
          "Rajarhat",
          "Raomari",
          "Ulipur",
        ],
      },
      {
        district: "Lalmonirhat",
        subDistricts: [
          "Aditmari",
          "Hatibandha",
          "Kaliganj",
          "Lalmonirhat Sadar",
          "Patgram",
        ],
      },
      {
        district: "Nilphamari",
        subDistricts: [
          "Dimla",
          "Domar",
          "Jaldhaka",
          "Kishoreganj",
          "Nilphamari Sadar",
          "Saidpur",
        ],
      },
      {
        district: "Panchagarh",
        subDistricts: [
          "Atwari",
          "Boda",
          "Debiganj",
          "Panchagarh Sadar",
          "Tetulia",
        ],
      },
      {
        district: "Rangpur",
        subDistricts: [
          "Badarganj",
          "Gangachara",
          "Kaunia",
          "Mithapukur",
          "Pirgacha",
          "Pirganj",
          "Rangpur Sadar",
          "Taraganj",
        ],
      },
      {
        district: "Thakurgaon",
        subDistricts: [
          "Baliadangi",
          "Haripur",
          "Pirganj",
          "Ranisankail",
          "Thakurgaon Sadar",
        ],
      },
    ],
  },
  {
    division: "Sylhet",
    districts: [
      {
        district: "Habiganj",
        subDistricts: [
          "Ajmiriganj",
          "Bahubal",
          "Baniachong",
          "Chunarughat",
          "Habiganj Sadar",
          "Lakhai",
          "Madhabpur",
          "Nabiganj",
          "Shaistaganj",
        ],
      },
      {
        district: "Moulvibazar",
        subDistricts: [
          "Barlekha",
          "Juri",
          "Kamalganj",
          "Kulaura",
          "Moulvibazar Sadar",
          "Rajnagar",
          "Sreemangal",
        ],
      },
      {
        district: "Sunamganj",
        subDistricts: [
          "Bishwambarpur",
          "Chhatak",
          "Derai",
          "Dharampasha",
          "Dowarabazar",
          "Jagannathpur",
          "Jamalganj",
          "Madhyanagar",
          "Sullah",
          "Sunamganj Sadar",
          "Tahirpur",
          "South Sunamganj",
        ],
      },
      {
        district: "Sylhet",
        subDistricts: [
          "Balaganj",
          "Beanibazar",
          "Bishwanath",
          "Companiganj",
          "Dakshin Surma",
          "Fenchuganj",
          "Golapganj",
          "Gowainghat",
          "Jaintiapur",
          "Jakiganj",
          "Kanaighat",
          "Osmaninagar",
          "Sylhet Sadar",
          "Zakiganj",
        ],
      },
    ],
  },
];

/**
 * Get all divisions
 * @returns string[]
 */
export function getAllDivisions(): string[] {
  return bangladeshAdministrativeData.map((d) => d.division);
}

/**
 * Get all districts by division
 * @param division string
 * @returns string[]
 */
export function getDistrictsByDivision({
  division,
}: {
  division: string;
}): string[] {
  const div = bangladeshAdministrativeData.find((d) => d.division === division);
  return div ? div.districts.map((d) => d.district) : [];
}

/**
 * Get all subdistricts by district
 * @param division string
 * @param district string
 * @returns string[]
 */
export function getSubDistrictsByDistrict({
  division,
  district,
}: {
  division: string;
  district: string;
}): string[] {
  const div = bangladeshAdministrativeData.find((d) => d.division === division);
  const dist = div?.districts.find((d) => d.district === district);
  return dist ? dist.subDistricts : [];
}
