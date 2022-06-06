export const truncateWallet = (str: string) => {
  const length = 4;

  return (
    str.slice(0, length) + "..." + str.slice(str.length - length, str.length)
  );
};
