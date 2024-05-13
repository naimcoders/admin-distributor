import React from "react";
import Template from "./Template";
import { setUser } from "src/stores/auth";

const Business = () => {
  const user = setUser((v) => v.user);
  console.log(user);

  return (
    <Template
      title="usaha"
      onClick={() => console.log("dd")}
      btnLabelForm="simpan"
    >
      Lorem ipsum dolor sit.
    </Template>
  );
};

export default Business;
