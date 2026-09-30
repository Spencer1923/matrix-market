"use client"; // needs the browser for the confirmation popup

import { deleteProduct } from "@/app/admin/actions";

export default function DeleteProductButton({ name }: { name: string }) {
  return (
    <button
      // formAction sends this row's form to deleteProduct instead of the Save action
      formAction={deleteProduct}
      formNoValidate // don't block deleting because of a half-edited price field
      onClick={(e) => {
        // Cancel the delete unless the admin confirms
        if (!confirm(`Delete "${name}"? This can't be undone.`)) e.preventDefault();
      }}
      className="rounded-lg border border-red-500 px-4 py-1.5 text-sm font-medium text-red-500 transition hover:bg-red-500 hover:text-white"
    >
      Delete
    </button>
  );
}