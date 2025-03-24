import { Button } from "@/components/ui/button.js";

const FormBlockerToast = ({ closeToast }: { closeToast: (result: "confirm" | "cancel") => void }) => {
  return (
    <div className="">
      <p aria-live="assertive">
          <strong>You have unsaved Changes!</strong> 
      </p>
      <p>Are you sure you want to leave?</p>
      <div className="mt-6 w-full flex justify-center gap-2 flex-wrap">
        <Button onClick={() => closeToast("confirm")} variant="destructive" className="sm:w-auto">
          Discard Changes
        </Button>
        <Button onClick={() => closeToast("cancel")} variant="positive" className="sm:w-auto">
          Keep Editing
        </Button>
      </div>
    </div>
  );
};

export default FormBlockerToast