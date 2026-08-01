import dotenv from "dotenv";

dotenv.config();

const apiUrl = (process.env.API_URL || "http://localhost:5000/api").replace(/\/$/, "");
const email = process.env.SEED_ADMIN_EMAIL;
const password = process.env.SEED_ADMIN_PASSWORD;

if (!email || !password) {
  console.error("SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD are required.");
  process.exit(1);
}

const curriculum = [
  [1, 1, "UCB009", "Chemistry"],
  [1, 1, "UES103", "Programming for Problem Solving"],
  [1, 1, "UES013", "Electrical & Electronics Engineering"],
  [1, 1, "UEN008", "Energy and Environment"],
  [1, 1, "UMA022", "Calculus for Engineers"],
  [1, 2, "UPH013", "Physics"],
  [1, 2, "UES101", "Engineering Drawing"],
  [1, 2, "UHU003", "Professional Communication"],
  [1, 2, "UES102", "Manufacturing Processes"],
  [1, 2, "UMA023", "Differential Equations and Linear Algebra"],
  [2, 3, "UCS303", "Operating System"],
  [2, 3, "UTA018", "Object Oriented Programming"],
  [2, 3, "UCS301", "Data Structures"],
  [2, 3, "UCS405", "Discrete Mathematical Structures"],
  [2, 3, "UTA016", "Engineering Design Project I"],
  [2, 3, "UMA021", "Numerical Linear Algebra"],
  [2, 3, "UHU052", "The Evolutionary Basis of Human Behaviour for Engineers"],
  [2, 3, "UCS320", "Introduction to Sustainable Green Computing"],
  [2, 4, "UCS415", "Design and Analysis of Algorithms"],
  [2, 4, "UCS310", "Database Management Systems"],
  [2, 4, "UCS414", "Computer Networks"],
  [2, 4, "UCS321", "AI for Engineers"],
  [2, 4, "UMA401", "Probability and Statistics"],
  [2, 4, "UTA024", "Engineering Design Project II"],
  [2, 4, "UTD003", "Aptitude Skills Building"],
  [3, 5, "UML501", "Machine Learning"],
  [3, 5, "UCS420", "Cognitive Computing"],
  [3, 5, "UCS553", "Enterprise Web Application"],
  [3, 5, "UCS503", "Software Engineering"],
  [3, 5, "UCS510", "Computer Architecture and Organization"],
  [3, 5, "UCS421", "Ethics and Risk Mitigation in AI"],
  [3, 6, "UCS701", "Theory of Computation"],
  [3, 6, "UMA071", "Optimization Techniques"],
  [3, 6, "UCS619", "Quantum Computing"],
  [3, 6, "UTA025", "Innovation and Entrepreneurship"],
  [3, 6, "UCS797", "Capstone Project - Start"],
  [3, 6, "UCSXXX", "Domain Specific Applications for Engineering Graduates"],
  [4, 7, "UCS802", "Compiler Construction"],
  [4, 7, "UHU005", "Humanities for Engineers"],
  [4, 7, "UCS714", "Agentic AI"],
  [4, 7, "UCS797", "Capstone Project"],
  [4, 8, "UCS898", "Project Semester"],
  [4, 8, "UCS813", "Social Network Analysis"],
  [4, 8, "UCS806", "Ethical Hacking"],
  [4, 8, "UCS899", "Project"],
  [4, 8, "UCS900", "Start-up Semester"],

  [3, 5, "UCS531", "Cloud Computing", "Elective I"],
  [3, 5, "UCS532", "Computer Vision", "Elective I"],
  [3, 5, "UCS534", "Computer & Network Security", "Elective I"],
  [3, 5, "UMC513", "Linear Algebra for Artificial Intelligence and Machine Learning", "Elective I"],
  [3, 5, "UCS548", "Foundation of Data Science", "Elective I"],
  [3, 5, "UCS539", "Finance, Accounting and Valuation", "Elective I"],
  [3, 5, "UCS537", "Source Code Management", "Elective I"],
  [3, 5, "UCS542", "UI & UX Specialist", "Elective I"],
  [3, 5, "UCS551", "Conversational AI: Accelerated Data Science", "Elective I"],
  [3, 5, "UCS547", "Edge AI and Robotics: Accelerated Data Science", "Elective I"],
  [3, 5, "UCS550", "Network Defence", "Elective I"],
  [3, 5, "UEC646", "Network and Communication for Connected Vehicles", "Elective I"],

  [3, 5, "UHU016", "Introductory Course in French", "Generic Elective"],
  [3, 5, "UHU017", "Introduction to Cognitive Science", "Generic Elective"],
  [3, 5, "UHU018", "Introduction to Corporate Finance", "Generic Elective"],
  [3, 5, "UCS002", "Introduction to Cyber Security", "Generic Elective"],
  [3, 5, "UPH064", "Nanoscience and Nanomaterials", "Generic Elective"],
  [3, 5, "UEN006", "Technologies for Sustainable Development", "Generic Elective"],
  [3, 5, "UMA069", "Graph Theory and Applications", "Generic Elective"],
  [3, 5, "UBT510", "Biology for Engineers", "Generic Elective"],
  [3, 5, "UMA070", "Advanced Numerical Methods", "Generic Elective"],
  [3, 5, "UTD004", "Campus 2 Corporate", "Generic Elective"],

  [3, 6, "UCS635", "GPU Computing", "Elective II"],
  [3, 6, "UCS636", "3D Modelling and Animation", "Elective II"],
  [3, 6, "UCS638", "Secure Coding", "Elective II"],
  [3, 6, "UMC622", "Matrix Computation", "Elective II"],
  [3, 6, "UCS654", "Predictive Analytics Using Statistics", "Elective II"],
  [3, 6, "UCS675", "Financial Markets and Portfolio Theory", "Elective II"],
  [3, 6, "UCS659", "Build and Release Management", "Elective II"],
  [3, 6, "UCS661", "Database Engineer", "Elective II"],
  [3, 6, "UCS664", "Conversational AI: Natural Language Processing", "Elective II"],
  [3, 6, "UCS668", "Edge AI and Robotics: Data Centre Vision", "Elective II"],
  [3, 6, "UCS673", "Ethical Hacking-1", "Elective II"],
  [3, 6, "UCS678", "Intelligent Transportation Systems", "Elective II"],

  [3, 6, "UCS645", "Parallel & Distributed Computing", "Elective III"],
  [3, 6, "UCS646", "Game Design & Development", "Elective III"],
  [3, 6, "UCS648", "Cyber Forensics", "Elective III"],
  [3, 6, "UMC633", "Mathematics for Quantum Computing", "Elective III"],
  [3, 6, "UCS761", "Deep Learning", "Elective III"],
  [3, 6, "UCS658", "Derivatives Pricing, Trading and Strategies", "Elective III"],
  [3, 6, "UCS660", "Continuous Integration and Continuous Deployment", "Elective III"],
  [3, 6, "UCS662", "Test Automation", "Elective III"],
  [3, 6, "UCS749", "Conversational AI: Speech Processing & Synthesis", "Elective III"],
  [3, 6, "UCS671", "Edge AI and Robotics: Embedded Vision", "Elective III"],
  [3, 6, "UCS674", "Ethical Hacking-II", "Elective III"],
  [3, 6, "UCS679", "Data Analytics in Automobile Engineering", "Elective III"],

  [4, 7, "UCS751", "Simulation & Modelling", "Elective IV"],
  [4, 7, "UCS752", "Augmented and Virtual Reality", "Elective IV"],
  [4, 7, "UCS754", "Blockchain Technology and Applications", "Elective IV"],
  [4, 7, "UMC744", "Cryptography and Coding Theory", "Elective IV"],
  [4, 7, "UCS772", "Data Science: Computer Vision & NLP", "Elective IV"],
  [4, 7, "UMC743", "Quantitative and Statistical Methods for Finance", "Elective IV"],
  [4, 7, "UCS758", "System Provisioning and Configuration Management", "Elective IV"],
  [4, 7, "UCS745", "Cloud & DevOps", "Elective IV"],
  [4, 7, "UCS748", "Generative AI", "Elective IV"],
  [4, 7, "UCS760", "Edge AI and Robotics: Reinforcement Learning & Conversational AI", "Elective IV"],
  [4, 7, "UCS750", "Computer Hacking and Forensic Investigation", "Elective IV"],
  [4, 7, "UCSXXX", "Cyber Security for Mobility Systems", "Elective IV"],
];

const placeholderCodes = new Set([
  "ELECTIVE-I",
  "ELECTIVE-II",
  "ELECTIVE-III",
  "ELECTIVE-IV",
  "GENERIC-ELECTIVE",
]);

async function request(path, options = {}) {
  const response = await fetch(`${apiUrl}${path}`, options);
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`${response.status} ${body.msg || response.statusText}`);
  return body;
}

const login = await request("/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});

const [branchesResponse, yearsResponse, subjectsResponse] = await Promise.all([
  request("/public/branches"),
  request("/public/years"),
  request("/public/subjects"),
]);

const branch = branchesResponse.data.find((item) => item.code === "CSE");
if (!branch) throw new Error("CSE branch was not found.");

const yearsByOrder = new Map(yearsResponse.data.map((year) => [year.order, year]));
const existing = new Set(
  subjectsResponse.data
    .filter((subject) => String(subject.branch?._id || subject.branch) === String(branch._id))
    .map((subject) => `${subject.year?.order}:${subject.code}`)
);

let created = 0;
let skipped = 0;
let removed = 0;

for (const subject of subjectsResponse.data) {
  const belongsToCse = String(subject.branch?._id || subject.branch) === String(branch._id);
  if (!belongsToCse || !placeholderCodes.has(subject.code)) continue;

  await request(`/admin/subjects/${subject._id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${login.token}` },
  });
  existing.delete(`${subject.year?.order}:${subject.code}`);
  console.log(`Removed placeholder: ${subject.code}`);
  removed += 1;
}

for (const [yearOrder, semester, code, name, electiveGroup] of curriculum) {
  const year = yearsByOrder.get(yearOrder);
  if (!year) throw new Error(`Academic year ${yearOrder} was not found.`);

  const key = `${yearOrder}:${code}`;
  if (existing.has(key)) {
    console.log(`Skipped existing: Semester ${semester} - ${code}`);
    skipped += 1;
    continue;
  }

  await request("/admin/subjects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${login.token}`,
    },
    body: JSON.stringify({
      name,
      code,
      branchId: branch._id,
      yearId: year._id,
      semester,
      description: [
        `B.E. CSE 2026 curriculum - Semester ${semester}`,
        electiveGroup ? `${electiveGroup} option` : null,
      ].filter(Boolean).join(" - "),
    }),
  });
  console.log(`Created: Semester ${semester} - ${code} ${name}`);
  existing.add(key);
  created += 1;
}

console.log(`CSE 2026 curriculum ready: ${created} created, ${skipped} skipped, ${removed} placeholders removed, ${curriculum.length} total.`);
