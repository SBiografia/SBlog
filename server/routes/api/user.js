//회원가입과 로그인 하는 것을 처리함
//JWT WEB token 방식
//token 안에 일정한 정볼르 담아서 login하거나 , post할 때 인증된 사람만 할 수 있게 인증을 확인함
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config/index";
const { JWT_SECRET } = config;

//Model
import User from "../../models/user";

const router = express.Router();

// @routes    GET api/user
// @desc      Get all user
// @access    public

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    if (!users) throw Error("No users");
    //성공코드 200
    res.status(200).json(users);
  } catch (e) {
    console.log(e);
    //실패코드 400
    res.status(400).json({ msg: e.message });
  }
});

//회원가입
// @routes    POST api/user
// @desc      Register user
// @access    public

router.post("/", (req, res) => {
  console.log(req, "req");
  const { name, email, password } = req.body;

  //Simple validation
  if (!name || !email || !password) {
    return res.status(400).json({ msg: "모든 필드를 채워주세요" });
  }

  //Check for existing user
  User.findOne({ email }).then((user) => {
    if (user)
      return res.status(400).json({ msg: "이미 가입된 유저가 존재합니다." });
    const newUser = new User({
      name,
      email,
      password,
    });
    //pw를 hash 숨겨줌
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser.save().then((user) => {
          jwt.sign(
            { id: user.id },
            JWT_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
              if (err) throw err;
              res.json({
                token,
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                },
              });
            }
          );
        });
      });
    });
  });
});

export default router;
