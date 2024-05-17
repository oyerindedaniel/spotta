const prismaSearchFilter = (keyword: string, fields: Array<string>) => {
  const filteredKeyword = keyword?.trim() || "";
  const filteredArgs = filteredKeyword.replace(/ /g, " | ");

  const combinedKeywordsSearch: any = [];
  const splittedKeywordsSearch: any = [];

  fields.forEach((field: string) => {
    combinedKeywordsSearch.push({
      [field]: { contains: filteredArgs, mode: "insensitive" },
    });
    filteredKeyword.split(" ").forEach((splittedKeyword: string) =>
      splittedKeywordsSearch.push({
        [field]: { contains: splittedKeyword, mode: "insensitive" },
      }),
    );
  });
  return [...combinedKeywordsSearch, ...splittedKeywordsSearch];
};

export default {
  prismaSearchFilter,
};
