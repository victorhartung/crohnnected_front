
import { PrismaClient, UserRole, Sex, SymptomSeverity, ReportStatus } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

// Sample PDF as base64 (minimal PDF for testing)
const samplePdfBase64 = `JVBERi0xLjQKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFsgMyAwIFIgXQovQ291bnQgMQo+PgplbmRvYmoKMyAwIG9iago8PAovVHlwZSAvUGFnZQovUGFyZW50IDIgMCBSCi9SZXNvdXJjZXMgPDwKL1Byb2NTZXQgWyAvUERGIC9UZXh0IF0KL0ZvbnQgPDwKL0YxIDQgMCBSCj4+Cj4+Ci9NZWRpYUJveCBbIDAgMCA2MTIgNzkyIF0KL0NvbnRlbnRzIDUgMCBSCj4+CmVuZG9iago0IDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9TdWJ0eXBlIC9UeXBlMQovQmFzZUZvbnQgL1RpbWVzLVJvbWFuCj4+CmVuZG9iago1IDAgb2JqCjw8Ci9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCi9GMSAxMiBUZgoyMCA3NTAgVGQKKFNhbXBsZSBNZWRpY2FsIFJlcG9ydCkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYKMDAwMDAwMDAwOSAwMDAwMCBuCjAwMDAwMDAwNTggMDAwMDAgbgowMDAwMDAwMTE1IDAwMDAwIG4KMDAwMDAwMDMxNyAwMDAwMCBuCjAwMDAwMDAzOTQgMDAwMDAgbgp0cmFpbGVyCjw8Ci9TaXplIDYKL1Jvb3QgMSAwIFIKPj4Kc3RhcnR4cmVmCjQ4OAolJUVPRgo=`;

const commonSymptoms = [
  'Abdominal pain',
  'Diarrhea', 
  'Fatigue',
  'Weight loss',
  'Nausea',
  'Vomiting',
  'Bloating',
  'Rectal bleeding',
  'Joint pain',
  'Skin problems',
  'Eye inflammation',
  'Mouth sores',
  'Loss of appetite',
  'Fever',
  'Night sweats'
];

const commonMedications = [
  'Mesalamine',
  'Prednisone',
  'Azathioprine', 
  'Methotrexate',
  'Infliximab',
  'Adalimumab',
  'Certolizumab',
  'Vedolizumab',
  'Ustekinumab',
  'Tofacitinib',
  'Budesonide',
  '6-Mercaptopurine',
  'Sulfasalazine',
  'Probiotics',
  'Iron supplements'
];

const countries = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Spain', 'Italy'];
const usStates = ['California', 'Texas', 'Florida', 'New York', 'Pennsylvania', 'Illinois', 'Ohio', 'Georgia'];
const cities = {
  'United States': ['Los Angeles', 'New York', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego'],
  'Canada': ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Quebec City'],
  'United Kingdom': ['London', 'Birmingham', 'Manchester', 'Glasgow', 'Leeds', 'Liverpool', 'Newcastle', 'Sheffield'],
  'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Newcastle', 'Canberra'],
  'Germany': ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Dortmund'],
  'France': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier'],
  'Spain': ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza', 'Málaga', 'Murcia', 'Palma'],
  'Italy': ['Rome', 'Milan', 'Naples', 'Turin', 'Palermo', 'Genoa', 'Bologna', 'Florence']
};

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getCoordinates(country: string, city: string): { lat: number; lng: number } {
  // Sample coordinates for major cities across various countries
  const coordinates: { [key: string]: { lat: number; lng: number } } = {
    // United States
    'Los Angeles': { lat: 34.0522, lng: -118.2437 },
    'New York': { lat: 40.7128, lng: -74.0060 },
    'Chicago': { lat: 41.8781, lng: -87.6298 },
    'Houston': { lat: 29.7604, lng: -95.3698 },
    'Phoenix': { lat: 33.4484, lng: -112.0740 },
    'Philadelphia': { lat: 39.9526, lng: -75.1652 },
    'San Antonio': { lat: 29.4241, lng: -98.4936 },
    'San Diego': { lat: 32.7157, lng: -117.1611 },

    // Canada
    'Toronto': { lat: 43.6532, lng: -79.3832 },
    'Montreal': { lat: 45.5017, lng: -73.5673 },
    'Vancouver': { lat: 49.2827, lng: -123.1207 },
    'Calgary': { lat: 51.0447, lng: -114.0719 },
    'Edmonton': { lat: 53.5461, lng: -113.4938 },
    'Ottawa': { lat: 45.4215, lng: -75.6972 },
    'Winnipeg': { lat: 49.8951, lng: -97.1384 },
    'Quebec City': { lat: 46.8139, lng: -71.2080 },

    // United Kingdom
    'London': { lat: 51.5074, lng: -0.1278 },
    'Birmingham': { lat: 52.4862, lng: -1.8904 },
    'Manchester': { lat: 53.4808, lng: -2.2426 },
    'Glasgow': { lat: 55.8642, lng: -4.2518 },
    'Leeds': { lat: 53.8008, lng: -1.5491 },
    'Liverpool': { lat: 53.4084, lng: -2.9916 },
    'Newcastle': { lat: 54.9783, lng: -1.6178 },
    'Sheffield': { lat: 53.3811, lng: -1.4701 },

    // Australia
    'Sydney': { lat: -33.8688, lng: 151.2093 },
    'Melbourne': { lat: -37.8136, lng: 144.9631 },
    'Brisbane': { lat: -27.4698, lng: 153.0251 },
    'Perth': { lat: -31.9505, lng: 115.8605 },
    'Adelaide': { lat: -34.9285, lng: 138.6007 },
    'Gold Coast': { lat: -28.0167, lng: 153.4000 },
    'Canberra': { lat: -35.2809, lng: 149.1300 },

    // Germany
    'Berlin': { lat: 52.5200, lng: 13.4050 },
    'Hamburg': { lat: 53.5511, lng: 9.9937 },
    'Munich': { lat: 48.1351, lng: 11.5820 },
    'Cologne': { lat: 50.9375, lng: 6.9603 },
    'Frankfurt': { lat: 50.1109, lng: 8.6821 },
    'Stuttgart': { lat: 48.7758, lng: 9.1829 },
    'Düsseldorf': { lat: 51.2277, lng: 6.7735 },
    'Dortmund': { lat: 51.5136, lng: 7.4653 },

    // France
    'Paris': { lat: 48.8566, lng: 2.3522 },
    'Marseille': { lat: 43.2965, lng: 5.3698 },
    'Lyon': { lat: 45.7640, lng: 4.8357 },
    'Toulouse': { lat: 43.6047, lng: 1.4442 },
    'Nice': { lat: 43.7102, lng: 7.2620 },
    'Nantes': { lat: 47.2184, lng: -1.5536 },
    'Strasbourg': { lat: 48.5734, lng: 7.7521 },
    'Montpellier': { lat: 43.6110, lng: 3.8767 },

    // Spain
    'Madrid': { lat: 40.4168, lng: -3.7038 },
    'Barcelona': { lat: 41.3851, lng: 2.1734 },
    'Valencia': { lat: 39.4699, lng: -0.3763 },
    'Seville': { lat: 37.3891, lng: -5.9845 },
    'Zaragoza': { lat: 41.6488, lng: -0.8891 },
    'Málaga': { lat: 36.7213, lng: -4.4214 },
    'Murcia': { lat: 37.9922, lng: -1.1307 },
    'Palma': { lat: 39.5696, lng: 2.6502 },

    // Italy
    'Rome': { lat: 41.9028, lng: 12.4964 },
    'Milan': { lat: 45.4642, lng: 9.1900 },
    'Naples': { lat: 40.8518, lng: 14.2681 },
    'Turin': { lat: 45.0703, lng: 7.6869 },
    'Palermo': { lat: 38.1157, lng: 13.3615 },
    'Genoa': { lat: 44.4056, lng: 8.9463 },
    'Bologna': { lat: 44.4949, lng: 11.3426 },
    'Florence': { lat: 43.7696, lng: 11.2558 }
  };

  return coordinates[city] || { lat: 40.7128, lng: -74.0060 }; // Default to NYC
}

async function hashPassword(password: string): Promise<string> {
  return await argon2.hash(password);
}

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean up existing data
  await prisma.auditLog.deleteMany();
  await prisma.report.deleteMany();
  await prisma.incidenceStat.deleteMany();
  await prisma.article.deleteMany();
  await prisma.protocol.deleteMany();
  await prisma.story.deleteMany();
  await prisma.patientProfile.deleteMany();
  await prisma.doctorProfile.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing data');

  // Create Admin User
  const adminPassword = await hashPassword('admin123');
  const admin = await prisma.user.create({
    data: {
      email: 'admin@crohnnected.com',
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
      name: 'System Administrator',
    },
  });

  // Create test account (required)
  const testPassword = await hashPassword('johndoe123');
  const testUser = await prisma.user.create({
    data: {
      email: 'john@doe.com',
      passwordHash: testPassword,
      role: UserRole.ADMIN, // Admin privileges as specified
      name: 'John Doe',
    },
  });

  // Create Doctors
  const doctors = [];
  for (let i = 1; i <= 2; i++) {
    const password = await hashPassword(`doctor${i}123`);
    const doctor = await prisma.user.create({
      data: {
        email: `doctor${i}@crohnnected.com`,
        passwordHash: password,
        role: UserRole.DOCTOR,
        name: `Dr. ${i === 1 ? 'Sarah Wilson' : 'Michael Chen'}`,
        doctorProfile: {
          create: {
            licenseNumber: `MD${String(i).padStart(6, '0')}`,
            specialty: i === 1 ? 'Gastroenterology' : 'Internal Medicine',
            country: 'United States',
            state: getRandomElement(usStates),
            city: getRandomElement(cities['United States']),
          },
        },
      },
    });
    doctors.push(doctor);
  }

  // Create Researchers
  const researchers = [];
  for (let i = 1; i <= 3; i++) {
    const password = await hashPassword(`researcher${i}123`);
    const researcher = await prisma.user.create({
      data: {
        email: `researcher${i}@crohnnected.com`,
        passwordHash: password,
        role: UserRole.RESEARCHER,
        name: `${i === 1 ? 'Dr. Emily Rodriguez' : i === 2 ? 'Dr. James Park' : 'Dr. Lisa Thompson'}`,
      },
    });
    researchers.push(researcher);
  }

  // Create Patients
  const patients = [];
  const patientNames = ['Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson', 'Emma Brown'];
  
  for (let i = 1; i <= 5; i++) {
    const password = await hashPassword(`patient${i}123`);
    const country = getRandomElement(countries);
    const cityList = cities[country as keyof typeof cities] || cities['United States'];
    const city = getRandomElement(cityList);
    const coords = getCoordinates(country, city);
    
    const patient = await prisma.user.create({
      data: {
        email: `patient${i}@example.com`,
        passwordHash: password,
        role: UserRole.PATIENT,
        name: patientNames[i - 1],
        patientProfile: {
          create: {
            birthDate: new Date(1980 + Math.floor(Math.random() * 25), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
            sex: getRandomElement([Sex.FEMALE, Sex.MALE, Sex.OTHER]),
            country,
            state: country === 'United States' ? getRandomElement(usStates) : null,
            city,
            lat: coords.lat + (Math.random() - 0.5) * 0.1, // Add some variation
            lng: coords.lng + (Math.random() - 0.5) * 0.1,
            diagnosisDate: new Date(2015 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
          },
        },
      },
    });
    patients.push(patient);
  }

  console.log('👥 Created users and profiles');

  // Create Reports (30 total: 20 approved, 10 pending)
  const reports = [];
  
  for (let i = 1; i <= 30; i++) {
    const patient = getRandomElement(patients);
    const isApproved = i <= 20;
    const doctor = isApproved ? getRandomElement(doctors) : null;
    const country = getRandomElement(countries);
    const cityList = cities[country as keyof typeof cities] || cities['United States'];
    const city = getRandomElement(cityList);
    const coords = getCoordinates(country, city);
    
    const symptoms = getRandomElements(commonSymptoms, Math.floor(Math.random() * 5) + 3);
    const medications = getRandomElements(commonMedications, Math.floor(Math.random() * 3) + 1);
    
    const surgeries = Math.random() > 0.7 ? [
      {
        type: getRandomElement(['Bowel resection', 'Stricturoplasty', 'Fistula repair', 'Abscess drainage']),
        year: 2018 + Math.floor(Math.random() * 5),
        notes: 'Successful procedure with good recovery'
      }
    ] : [];

    const reportData = {
      patientId: patient.id,
      ageAtReport: 25 + Math.floor(Math.random() * 40),
      sex: getRandomElement([Sex.FEMALE, Sex.MALE, Sex.OTHER]),
      country,
      state: country === 'United States' ? getRandomElement(usStates) : null,
      city,
      lat: coords.lat + (Math.random() - 0.5) * 0.1,
      lng: coords.lng + (Math.random() - 0.5) * 0.1,
      symptoms,
      symptomSeverity: getRandomElement([SymptomSeverity.MILD, SymptomSeverity.MODERATE, SymptomSeverity.SEVERE]),
      medications,
      flareFrequencyPerYear: Math.floor(Math.random() * 12) + 1,
      surgeryHistory: surgeries,
      notes: `Patient reports ${getRandomElement(['improvement', 'worsening', 'stable condition'])} with current treatment regimen.`,
      diagnosisDate: new Date(2010 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      status: isApproved ? ReportStatus.APPROVED : ReportStatus.PENDING,
      approvedById: doctor?.id,
      approvedAt: isApproved ? new Date() : null,
      // Add PDF to first report for testing
      ...(i === 1 && {
        documentBase64: samplePdfBase64,
        documentOriginalName: 'medical-report-001.pdf',
        documentMime: 'application/pdf',
        documentSizeBytes: Buffer.from(samplePdfBase64, 'base64').length,
      }),
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000), // Random date within last year
    };

    const report = await prisma.report.create({
      data: reportData,
    });
    reports.push(report);
  }

  console.log('📊 Created reports');

  // Create Hub Content - Articles
  const articles = [
    {
      title: 'Understanding Crohn\'s Disease: A Comprehensive Guide',
      slug: 'understanding-crohns-disease-comprehensive-guide',
      summary: 'Learn about the basics of Crohn\'s disease, its symptoms, causes, and treatment options.',
      content: `# Understanding Crohn's Disease

Crohn's disease is a type of inflammatory bowel disease (IBD) that causes chronic inflammation of the gastrointestinal tract. This comprehensive guide covers everything you need to know about this condition.

## What is Crohn's Disease?

Crohn's disease can affect any part of the digestive tract from mouth to anus, but most commonly affects the end of the small bowel (ileum) and the beginning of the colon.

## Symptoms

Common symptoms include:
- Persistent diarrhea
- Rectal bleeding
- Urgent need to move bowels
- Abdominal cramps and pain
- Sensation of incomplete evacuation
- Constipation (can lead to bowel obstruction)

## Treatment Options

Treatment typically involves:
1. **Medications**: Anti-inflammatory drugs, immune system suppressors
2. **Lifestyle changes**: Diet modifications, stress management
3. **Surgery**: In severe cases where medications are not effective`,
      tags: ['education', 'symptoms', 'treatment'],
      isPublic: true,
      createdById: admin.id,
    },
    {
      title: 'Managing Crohn\'s Disease Through Diet',
      slug: 'managing-crohns-disease-through-diet',
      summary: 'Nutritional strategies and dietary recommendations for Crohn\'s disease management.',
      content: `# Managing Crohn's Disease Through Diet

While there's no specific diet that causes or cures Crohn's disease, certain foods may trigger symptoms or help manage the condition.

## Foods to Consider Limiting

- High-fiber foods during flares
- Dairy products (if lactose intolerant)
- Spicy foods
- High-fat foods
- Alcohol and caffeine

## Beneficial Foods

- Omega-3 rich fish
- Lean proteins
- Well-cooked vegetables
- Probiotics
- Plenty of fluids

## Working with Healthcare Providers

Always consult with your healthcare team before making significant dietary changes.`,
      tags: ['diet', 'nutrition', 'management'],
      isPublic: true,
      createdById: doctors[0].id,
    }
  ];

  for (const articleData of articles) {
    await prisma.article.create({
      data: articleData,
    });
  }

  // Create Protocols
  const protocols = [
    {
      title: 'Standard Treatment Protocol for Newly Diagnosed Crohn\'s Disease',
      slug: 'standard-treatment-protocol-newly-diagnosed-crohns',
      summary: 'Evidence-based treatment approach for patients newly diagnosed with Crohn\'s disease.',
      content: `# Standard Treatment Protocol for Newly Diagnosed Crohn's Disease

## Initial Assessment

1. Complete medical history and physical examination
2. Laboratory tests: CBC, CRP, ESR, vitamin levels
3. Imaging studies: CT enterography or MRI
4. Endoscopic evaluation with biopsy

## Treatment Approach

### Mild to Moderate Disease
- First-line: 5-aminosalicylates (mesalamine)
- Prednisone for acute flares
- Consider immunomodulators for maintenance

### Moderate to Severe Disease
- Anti-TNF therapy (infliximab, adalimumab)
- Combination therapy with immunomodulators
- Monitor for complications

## Follow-up Protocol

- Clinical assessment every 3-6 months
- Laboratory monitoring
- Endoscopic surveillance as indicated`,
      tags: ['protocol', 'treatment', 'diagnosis'],
      isPublic: false, // Restricted to healthcare providers
      createdById: doctors[1].id,
    }
  ];

  for (const protocolData of protocols) {
    await prisma.protocol.create({
      data: protocolData,
    });
  }

  // Create Stories
  const stories = [
    {
      title: 'My Journey with Crohn\'s: Finding Hope After Diagnosis',
      summary: 'A patient\'s personal story of living with Crohn\'s disease and finding effective treatment.',
      content: `When I was first diagnosed with Crohn's disease at age 24, I felt overwhelmed and scared. The symptoms had been building for months - the constant fatigue, abdominal pain, and urgent bathroom trips were taking over my life.

But with the help of my healthcare team and the support of the Crohnnected community, I've learned to manage my condition effectively. Today, I'm in remission and living a full, active life.

The key has been finding the right treatment combination, making dietary adjustments, and having a strong support system. To anyone newly diagnosed - there is hope, and you're not alone in this journey.`,
      tags: ['patient-story', 'hope', 'diagnosis'],
      isPublic: true,
      createdById: patients[0].id,
    }
  ];

  for (const storyData of stories) {
    await prisma.story.create({
      data: storyData,
    });
  }

  console.log('📚 Created Hub content');

  // Create Incidence Statistics
  const incidenceData = [
    {
      regionCode: 'US-CA',
      regionName: 'California, USA',
      country: 'United States',
      state: 'California',
      city: 'Los Angeles',
      lat: 34.0522,
      lng: -118.2437,
      period: '2025Q1',
      cases: 1250,
      source: 'CDC Health Statistics',
    },
    {
      regionCode: 'US-NY',
      regionName: 'New York, USA',
      country: 'United States',
      state: 'New York',
      city: 'New York',
      lat: 40.7128,
      lng: -74.0060,
      period: '2025Q1',
      cases: 980,
      source: 'State Health Department',
    },
    {
      regionCode: 'CA-ON',
      regionName: 'Ontario, Canada',
      country: 'Canada',
      state: 'Ontario',
      city: 'Toronto',
      lat: 43.6532,
      lng: -79.3832,
      period: '2025Q1',
      cases: 675,
      source: 'Health Canada',
    },
    {
      regionCode: 'UK-LON',
      regionName: 'London, UK',
      country: 'United Kingdom',
      state: 'England',
      city: 'London',
      lat: 51.5074,
      lng: -0.1278,
      period: '2025Q1',
      cases: 520,
      source: 'NHS Statistics',
    }
  ];

  for (const statData of incidenceData) {
    await prisma.incidenceStat.create({
      data: statData,
    });
  }

  console.log('📈 Created incidence statistics');

  // Create some audit logs
  for (const report of reports.slice(0, 20)) { // Only for approved reports
    if (report.approvedById) {
      await prisma.auditLog.create({
        data: {
          actorId: report.approvedById,
          action: 'APPROVE_REPORT',
          entity: 'Report',
          entityId: report.id,
          meta: {
            reportId: report.id,
            patientId: report.patientId,
            approvedAt: report.approvedAt,
          },
        },
      });
    }
  }

  console.log('📝 Created audit logs');

  console.log('✅ Database seeded successfully!');
  console.log('\n📊 Summary:');
  console.log(`- 1 Admin user (admin@crohnnected.com)`);
  console.log(`- 1 Test account (john@doe.com) with admin privileges`);
  console.log(`- 2 Doctor users`);
  console.log(`- 3 Researcher users`);
  console.log(`- 5 Patient users`);
  console.log(`- 30 Reports (20 approved, 10 pending)`);
  console.log(`- 1 Report with sample PDF attachment`);
  console.log(`- 2 Articles`);
  console.log(`- 1 Protocol`);
  console.log(`- 1 Patient Story`);
  console.log(`- 4 Incidence Statistics records`);
  console.log(`- 20 Audit log entries`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
