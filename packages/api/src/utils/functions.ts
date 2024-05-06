const generateRandomString = (length: number) => {
  const randomChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < Number(length); i += 1) {
    result += randomChars.charAt(
      Math.floor(Math.random() * randomChars.length),
    );
  }
  return result;
};

const generateRandomNumber = (length: number) => {
  const randomChars = "0123456789";
  let result = "";
  for (let i = 0; i < Number(length); i += 1) {
    result += randomChars.charAt(
      Math.floor(Math.random() * randomChars.length),
    );
  }
  return result;
};

export { generateRandomNumber, generateRandomString };
