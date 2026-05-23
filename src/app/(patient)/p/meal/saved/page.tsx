import { Suspense } from "react";
import { PatientMealSavedScreen } from "@/components/patient/screens/meal-saved-screen";

export default function PatientMealSavedPage() {
  return (
    <Suspense fallback={null}>
      <PatientMealSavedScreen />
    </Suspense>
  );
}
