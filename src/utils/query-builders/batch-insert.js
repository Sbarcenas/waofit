module.exports = {
  query: {
    insert: async function (Model, data = []) {
      let { tableName } = Model;
      const values = data
        .map((item) => {
          return `(${Object.values(item).map((it) => {
            console.log(typeof it);
            if (typeof it == "string") {
              it = '"' + it + '"';
            }
            if (typeof it == "object") {
              it = "'" + JSON.stringify(it) + "'";
            }

            return it;
          })})`;
        })
        .join(", ");

      if (data.length == 0) throw new Error("data is empty");
      data = data[0];
      const keys = Object.keys(data).join(",");
      let query = `INSERT INTO ${tableName}(${keys}) VALUES ${values}`;

      console.log(query, "QUEYYYYYYYYYY");
      return await Model.raw(query);
    },
  },
};
