// Delete.js
import { router } from "@inertiajs/react";
import { Button } from "@/shadcn/ui/button";
import { useState } from "react";

export default function Delete({ model, onDialogConfig, params }) {
    const [deleting, setDeleting] = useState(false);

    const handleDelete = () => {
        setDeleting(true);
        router.delete(route("provinces.destroy", model.id), {
            onSuccess: () => {
                setDeleting(false);
                onDialogConfig(null); // Close the dialog after deletion
            },
            onError: () => {
                setDeleting(false); // Reset state if there's an error
            },
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <div>
            <p>Are you sure you want to delete this item?</p>
            <div className="mt-4 flex justify-end space-x-2">
                <Button onClick={() => onDialogConfig(null)} variant="secondary">
                    Cancel
                </Button>
                <Button onClick={handleDelete} disabled={deleting} variant="destructive">
                    {deleting ? "Deleting..." : "Delete"}
                </Button>
            </div>
        </div>
    );
}
