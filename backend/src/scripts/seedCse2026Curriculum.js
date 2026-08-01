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
  [3, 5, "ELECTIVE-I", "Elective I"],
  [3, 5, "GENERIC-ELECTIVE", "Generic Elective"],
  [3, 5, "UCS421", "Ethics and Risk Mitigation in AI"],
  [3, 6, "UCS701", "Theory of Computation"],
  [3, 6, "UMA071", "Optimization Techniques"],
  [3, 6, "UCS619", "Quantum Computing"],
  [3, 6, "UTA025", "Innovation and Entrepreneurship"],
  [3, 6, "ELECTIVE-II", "Elective II"],
  [3, 6, "ELECTIVE-III", "Elective III"],
  [3, 6, "UCS797", "Capstone Project - Start"],
  [3, 6, "UCSXXX", "Domain Specific Applications for Engineering Graduates"],
  [4, 7, "UCS802", "Compiler Construction"],
  [4, 7, "UHU005", "Humanities for Engineers"],
  [4, 7, "UCS714", "Agentic AI"],
  [4, 7, "ELECTIVE-IV", "Elective IV"],
  [4, 7, "UCS797", "Capstone Project"],
  [4, 8, "UCS898", "Project Semester"],
  [4, 8, "UCS813", "Social Network Analysis"],
  [4, 8, "UCS806", "Ethical Hacking"],
  [4, 8, "UCS899", "Project"],
  [4, 8, "UCS900", "Start-up Semester"],
];

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

for (const [yearOrder, semester, code, name] of curriculum) {
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
      description: `B.E. CSE 2026 curriculum - Semester ${semester}`,
    }),
  });
  console.log(`Created: Semester ${semester} - ${code} ${name}`);
  existing.add(key);
  created += 1;
}

console.log(`CSE 2026 curriculum ready: ${created} created, ${skipped} skipped, ${curriculum.length} total.`);
