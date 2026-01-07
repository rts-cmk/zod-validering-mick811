import { z } from "zod";

export const schema = z
  .object({
    firstName: z
      .string()
      .min(2, "Fornavn skal være mindst 2 tegn")
      .max(100, "Fornavn må ikke være længere end 100 tegn"),
    lastName: z
      .string()
      .min(2, "Efternavn skal være mindst 2 tegn")
      .max(100, "Efternavn må ikke være længere end 100 tegn"),
    email: z.email("Ugyldig email adresse"),
    password: z
      .string()
      .min(8, "Adgangskode skal være mindst 8 tegn")
      .max(100, "Adgangskode må ikke være længere end 100 tegn")
      .regex(/[A-Z]/, "Adgangskode skal indeholde mindst ét stort bogstav")
      .regex(/[a-z]/, "Adgangskode skal indeholde mindst ét lille bogstav")
      .regex(/[0-9]/, "Adgangskode skal indeholde mindst ét tal")
      .regex(
        /[!@#$%^&*]/,
        "Adgangskode skal indeholde mindst ét specialtegn (!@#$%^&*)"
      ),
    confirmPassword: z.string(),
    birthday: z
      .date("Ugyldig fødselsdato")
      .transform((val) => new Date(val))
      .refine(
        (date) => date >= new Date(1900, 0, 1),
        "Fødselsdato skal være efter 1900"
      )
      .refine((date) => {
        const minimumAge = new Date();
        minimumAge.setFullYear(minimumAge.getFullYear() - 18);
        return date <= minimumAge;
      }, "Du skal være mindst 18 år gammel"),
    phoneNumber: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^[0-9]{8}$/.test(val),
        "Telefonnummer skal være præcis 8 cifre"
      ),
    address: z.string().min(5, "Adresse skal være mindst 5 tegn"),
    zipCode: z
      .string()
      .regex(/^[0-9]{4}$/, "Postnummer skal være præcis 4 cifre"),
  })

  // vi refiner uden for password og confirmPassword's scope
  // så vi kan bruge dem begge, uden at få en fejl
  .refine((data) => data.password === data.confirmPassword, {
    message: "Adgangskoderne er ikke ens",
    path: ["confirmPassword"],
  });

export type FormData = z.infer<typeof schema>;
