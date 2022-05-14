const vars = {
  password: {
    minLength: 8,
    maxLength: 32,
    needs: {
      letters: {
        lowercase: false,
        uppercase: false,
      },
      numbers: false,
      symbols: false,
    },
  },
};

const regex = {
  email: new RegExp(`^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$`),
  password: new RegExp(
    `^${vars.password.needs.numbers ? `(?=.*[0-9])` : ``}${
      vars.password.needs.letters.lowercase ? `(?=.*[a-z])` : ``
    }${vars.password.needs.letters.uppercase ? `(?=.*[A-Z])` : ``}${
      vars.password.needs.symbols ? `(?=.*[!@#$%^&-+=()*])` : ``
    }(?=\\S+$).{${vars.password.minLength},${vars.password.maxLength}}$`
  ),
  hexColor: {
    threeLetter: new RegExp(`^#([A-Fa-f0-9]{3})$`),
    sixLetter: new RegExp(`^#[A-Fa-f0-9]{6}$`),
  },
};

export const check = {
  chars: {
    email: (email: string): string => {
      if (!email) throw new Error("Email is required");

      email = email.toLowerCase();

      if (!regex.email.test(email)) throw new Error("Invalid email");

      return email;
    },
    password: (password: string): string => {
      if (!password) throw new Error("Password is required");

      if (!regex.password.test(password)) throw new Error("Invalid password");

      return password;
    },
    color: (color: string): string => {
      if (!color) throw new Error("Color is required");

      color = color.toLowerCase();

      if (
        !regex.hexColor.threeLetter.test(color) &&
        !regex.hexColor.sixLetter.test(color)
      )
        throw new Error("Invalid color");

      if (regex.hexColor.threeLetter.test(color))
        color.replace(
          "#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])",
          "#$1$1$2$2$3$3"
        );

      return color;
    },
  },
};
