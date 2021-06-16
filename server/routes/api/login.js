import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import auth from "../../middleware/auth";
import config from "../../config/index";
const { JWT_SECRET } = config;

//Mode
import User from "../../models/user";

const router = express.Router();

// @route   POST api/auth
// @desc    Auth user
// @access  Public
// LOGIN 과정
router.post("/", (req, res) => {
  const { email, password } = req.body;

  //simple validation
  if (!email || !password) {
    return res.status(400).json({ msg: "모든 필드를 채워주세요" });
  }

  //check for existing user
  User.findOne({ email }).then((user) => {
    if (!user)
      return res.status(400).json({ msg: "유저가 존재하지 않습니다." });

    //validate password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (!isMatch)
        return res.status(400).json({ msg: "비밀번호가 일치하지 않습니다." });
      jwt.sign(
        { id: user.id },
        JWT_SECRET,
        { expiresIn: "2 days" },
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            },
          });
        }
      );
    });
  });
});

// LOGOUT 과정
// logout 은 front 에서 redux-saga 로 할 예정이라서 응답만 주어지면 redux로 처리라서 성공메시지만 보내주면 됨
router.post("/logout", (req, res) => {
  res.json("로그아웃 성공");
});

router.get("/user", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) throw Error("유저가 존재하지 않습니다.");
    res.json(user);
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: e.message });
  }
});

export default router;
