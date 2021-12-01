const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory('MyEpicGame');
  const gameContract = await gameContractFactory.deploy(
    ["  Kratos", "Ryu", "Cortana"],       // Names
    ["QmRx99epswa9MEuRG4uHXMPm9BjpgztX1G9MZ1zYNLMozg", // Images
    "QmXh3MW5ugiySdk7FaHpBgJGbhn3mfxfk7kHusgPHVKUy7", 
    "QmThXvdYsFQKc9BQaAsbFuB6KvTaNpwPumF2PTaZVGdM3H"],
    [500, 600, 700],    // HP values
    [100, 50, 25],       // Attack damage values
    "Sam Fisher", // Boss name
    "QmcBunKeFVkuiqFPr6mp3uDRP6TedyWXqqHgkptgLjp1ue", // Boss image
    1000, // Boss hp
    50 // Boss attack damage
  );
  await gameContract.deployed();
  console.log("Contract deployed to:", gameContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();