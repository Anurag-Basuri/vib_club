import Insta from "instamojo-nodejs";

Insta.setKeys(
  process.env.INSTAMOJO_API_KEY || "68422fce4df07f082b83f80ec8aa9eb6",
  process.env.INSTAMOJO_AUTH_TOKEN || "d56633e22ecc452b397caae09f546ec7"
);

// Use test or production mode
Insta.isSandboxMode(process.env.NODE_ENV !== "production");

export default Insta;
