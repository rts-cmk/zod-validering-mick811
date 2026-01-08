import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { type FormData, schema } from "@/lib/schema";

export function App() {
  // vi bruger Omit til at lave en type, der minder om FormData,
  // men hvor vi specifikt fjerner password-felterne, da de ikke skal gemmes i staten.
  const [submitted, setSubmitted] = useState<Omit<
    FormData,
    "password" | "confirmPassword"
  > | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange", // validere når der skrives i felterne
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    // vi bruger destructuring til at hive password-felterne ud,
    // og samler resten af felterne i 'rest' variablen vha. spread operator (...).
    // på den måde undgår vi at gemme/vise adgangskoderne i vores state.
    const { password, confirmPassword, ...rest } = data;
    setSubmitted(rest);
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        {/* Fornavn */}
        <label htmlFor="firstName">Fornavn:</label>
        <input {...register("firstName", { required: true })} />
        {errors.firstName && (
          <span className="error">{errors.firstName.message}</span>
        )}

        {/* Efternavn */}
        <label htmlFor="lastName">Efternavn:</label>
        <input {...register("lastName", { required: true })} />
        {errors.lastName && (
          <span className="error">{errors.lastName.message}</span>
        )}

        {/* Email */}
        <label htmlFor="email">Email:</label>
        <input {...register("email", { required: true })} />
        {errors.email && <span className="error">{errors.email.message}</span>}

        {/* Password */}
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          {...register("password", { required: true })}
          onChange={(e) => {
            register("password").onChange(e);
            // tjek altid confirmPassword igen når password ændres, så de holdes synkroniseret
            trigger("confirmPassword");
          }}
        />
        {errors.password && (
          <span className="error">{errors.password.message}</span>
        )}

        {/* Confirm Password */}
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          type="password"
          {...register("confirmPassword", { required: true })}
        />
        {errors.confirmPassword && (
          <span className="error">{errors.confirmPassword.message}</span>
        )}

        {/* Birthday */}
        <label htmlFor="birthday">Birthday:</label>
        <input type="date" {...register("birthday", { required: true })} />
        {errors.birthday && (
          <span className="error">{errors.birthday.message}</span>
        )}

        {/* Phone Number */}
        <label htmlFor="phoneNumber">Phone Number:</label>
        <input {...register("phoneNumber")} />
        {errors.phoneNumber && (
          <span className="error">{errors.phoneNumber.message}</span>
        )}

        {/* Adresse */}
        <label htmlFor="address">Adresse:</label>
        <input {...register("address", { required: true })} />
        {errors.address && (
          <span className="error">{errors.address.message}</span>
        )}

        {/* Postnummer */}
        <label htmlFor="zipCode">Postnummer:</label>
        <input {...register("zipCode", { required: true })} />
        {errors.zipCode && (
          <span className="error">{errors.zipCode.message}</span>
        )}

        <button type="submit">Send</button>
      </form>

      {submitted && (
        <div className="success">
          <h2>tak for din registrering!</h2>
          <p>data som blev modtaget:</p>
          <pre>{JSON.stringify(submitted, null, 2)}</pre>
          <button type="button" onClick={() => setSubmitted(null)}>
            ryd data
          </button>
        </div>
      )}
    </div>
  );
}
