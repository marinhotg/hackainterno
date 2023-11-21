import { artifacts, ethers } from "hardhat";
import fs from "fs";
import path from "path";
import { Contract } from "ethers";

export async function main() {
    const mCFactory = await ethers.getContractFactory("MedicalCertificate");

    const medicalCertificate = await mCFactory.deploy();

    console.log("MedicalCertificate deployed to:", medicalCertificate.address);

    saveFrontendFiles(medicalCertificate, "MedicalCertificate");
}

function saveFrontendFiles(contract: Contract, name: string) {
	const contractsDir = path.join(__dirname, "..", "..", "frontend", "src", "contracts");
  
	if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
	}
  const ContractArtifact = artifacts.readArtifactSync(name);
  
	fs.writeFileSync(
    path.join(contractsDir, "contract-config.json"),
    JSON.stringify({ address: contract.address, abi: ContractArtifact.abi }, undefined, 2)
	);
}

main().then(() => {
  console.log('Everything is up and running!')
}).catch((error) => {
	console.error(error);
	process.exitCode = 1;
});