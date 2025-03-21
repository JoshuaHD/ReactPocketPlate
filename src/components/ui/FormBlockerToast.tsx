import { Button } from "@/components/ui/button.js";

const FormBlockerToast = ({ closeToast }: { closeToast: (result: "confirm" | "cancel") => void }) => {
  return (
    <div className="flex flex-col gap-3">
      <p aria-live="assertive">
          <strong>You have unsaved Changes!</strong> 
      </p>
      <p>Are you sure you want to leave?</p>
      <div className="flex justify-between gap-2">
        <Button onClick={() => closeToast("confirm")} variant="destructive" className="w-full sm:w-auto">
          Discard Changes
        </Button>
        <Button onClick={() => closeToast("cancel")} className="w-full sm:w-auto">
          Keep Editing
        </Button>
      </div>
    </div>
  );
};

export default FormBlockerToast