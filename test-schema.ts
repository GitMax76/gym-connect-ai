
import { trainerRegistrationSchema } from './src/schemas/auth';

const validData = {
    firstName: "Mario",
    lastName: "Verificato",
    email: "mario.verify.fix@test.com",
    password: "Password123!",
    phone: "+39 333 9998887",
    dateOfBirth: "1985-01-01",
    city: "Roma",
    preferredAreas: "Centro",
    certifications: ["CONI"],
    specializations: ["Personal Training"],
    experience: 10,
    languages: ["Italiano", "Inglese"],
    availability: ["Lunedì Mattina"],
    personalRate: 60,
    groupRate: 40,
    bio: "Test bio for verification."
};

try {
    trainerRegistrationSchema.parse(validData);
    console.log("Validation Successful");
} catch (e) {
    console.error("Validation Failed", JSON.stringify(e.errors, null, 2));
}
