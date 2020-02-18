module.exports = {
  query: {
    insert: async function(Model, data = []) {
      let { tableName } = Model;
      const values = data
        .map(item => {
          return `(${Object.values(item).join(",")})`;
        })
        .join(", ");
      if (data.length == 0) throw new Error("data is empty");
      data = data[0];
      const keys = Object.keys(data).join(",");
      let query = `INSERT INTO ${tableName}(${keys}) VALUES ${values}`;
      console.log("Query: ", query);
      return await Model.raw(query);
    }
  }
};
