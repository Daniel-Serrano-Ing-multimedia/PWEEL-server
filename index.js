const mongoose = require("mongoose");
const app = require("./app");
const port = process.env.PORT || 3977;

const { API_NAME, API_VERSION, IP_SERVER, CLUSTER_USER, CLUSTER_PASSWORD, CLUSTER_DATA_BASE } = require("./config");

//mongoose.connect( `mongodb://localhost:27017/daneilalejandroserrano` );
//conexion de server a basse de datos
mongoose.set("useFindAndModify", false);
mongoose.connect(
  `mongodb+srv://${ CLUSTER_USER }:${ CLUSTER_PASSWORD }@webpersonalcurso.ra4ql.mongodb.net/${ CLUSTER_DATA_BASE }?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, res) => {
    if (err) {
      throw err;
    } else {
      console.log("la conexiona a la BD es correcta");
      app.listen(port, () => {
        console.log("#############################");
        console.log("########## API REST #########");
        console.log("#############################");
        console.log(`http://${ IP_SERVER }:${ port }/${ API_NAME }/${ API_VERSION }/`);
      });
    }
  }
);