import fs from "node:fs";

const envText = fs.readFileSync(".env", "utf8");
const line = envText.split(/\r?\n/).find((l) => l.startsWith("MONGODB_URL="));

if (!line) {
  console.error(".env te MONGODB_URL paoa jayni");
  process.exit(1);
}

const url = line.slice("MONGODB_URL=".length).trim();
const m = url.match(/^mongodb\+srv:\/\/([^:]+):(.+)@([^@/]+)\/?(\?.*)?$/);

if (!m) {
  console.error("MONGODB_URL mongodb+srv:// format e nai");
  process.exit(1);
}

const [, user, pw, host] = m;

const doh = async (name, type) => {
  const res = await fetch(
    `https://dns.google/resolve?name=${name}&type=${type}`,
    { headers: { accept: "application/dns-json" } },
  );
  const json = await res.json();
  return json.Answer ?? [];
};

const srv = await doh(`_mongodb._tcp.${host}`, "SRV");
const txt = await doh(host, "TXT");

if (srv.length === 0) {
  console.error("SRV record paoa jayni");
  process.exit(1);
}

const hosts = srv.map((a) => {
  const parts = a.data.split(" ");
  const port = parts[2];
  const target = parts[3].replace(/\.$/, "");
  return `${target}:${port}`;
});

const txtOptions = txt.length ? txt[0].data.replace(/"/g, "") : "authSource=admin";

console.log("\nEi line ta .env e MONGODB_URL er jaygay boshao (kauke pathabe na):\n");
console.log(
  `MONGODB_URL=mongodb://${user}:${pw}@${hosts.join(",")}/?${txtOptions}&tls=true&appName=Cluster0\n`,
);