// Updated Index.js

import PaginationEx from "@/Components/PaginationEx";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import SearchInput from "@/Components/SearchInput";
import Create from "./Create";
import Update from "./Update";
import Show from "./Show";
import Delete from "./Delete";
import dayjs from "dayjs";
import { Head, router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { titleCase } from "@/lib/util";
import { Eye, Loader2, MoveDown, MoveUp, MoveVertical, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/shadcn/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import { Separator } from "@/shadcn/ui/separator";
import { useToast } from "@/shadcn/hooks/use-toast";

export default function Index({ auth, model, regions, queryParams = null }) {
    queryParams = queryParams || {};

    const resourceName = "Paluwagan Members";
    const { toast } = useToast();
    const { flash } = usePage().props;
    const [search, setSearch] = useState(queryParams.search || "");
    const [loading, setLoading] = useState(false);
    const [dialogConfig, setDialogConfig] = useState({
        open: false,
        process: "",
        data: null,
    });

    const onSearchSubmit = (e) => {
        e.preventDefault();
        router.get(route("provinces.index"), { search, sort_field: "created_at", sort_direction: "desc" });
    };

    const onDialogConfig = (config) => {
        if (!config) {
            setDialogConfig({ open: false, process: "", data: null });
        } else {
            setDialogConfig(config);
        }
    };

    const sortChanged = (name) => {
        queryParams.sort_field = name;
        queryParams.sort_direction = queryParams.sort_direction === "asc" ? "desc" : "asc";
        router.get(route("provinces.index"), { ...queryParams });
    };

    useEffect(() => {
        if (flash?.message) {
            toast({ className: cn("top-0 right-0 fixed md:max-w-[420px] md:top-4 md:right-4"), description: flash.message });
            flash.message = "";
        }
    }, [flash]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 leading-tight">{titleCase(resourceName)}</h2>
            }
        >
            <Head title={titleCase(resourceName)} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-black dark:bg-gray-800 shadow-sm sm:rounded-lg">
                        <div className="p-6 text-black-900 dark:text-gray-100">
                            <div className="md:flex justify-between mb-6">
                                <SearchInput
                                    search={search}
                                    onSearchChanged={(e) => setSearch(e.target.value)}
                                    onLoading={() => setLoading(true)}
                                    onSearchSubmit={onSearchSubmit}
                                    route={route("provinces.index", { sort_field: "created_at", sort_direction: "desc" })}
                                />
                                {loading && <Loader2 className="absolute -right-16 w-10 animate-spin" />}
                                <Create resourceName={resourceName} regions={regions} />
                            </div>

                            <div className="overflow-hidden shadow rounded-lg">
                                <div className="p-4 dark:bg-gray-600 bg-green-500 flex items-center justify-between">
                                    <PaginationEx links={model.links} meta={model.meta} onLoading={() => setLoading(true)} />
                                </div>

                                <table className="w-full text-sm bg-gray-100 dark:bg-gray-700">
                                    <thead>
                                        <tr className="text-left border-b border-gray-200 dark:border-gray-600">
                                            <th
                                                onClick={() => sortChanged("name")}
                                                className="px-4 py-2 text-gray-600 dark:text-gray-300 cursor-pointer"
                                            >
                                                <div className="flex items-center gap-1">
                                                    Name
                                                    {queryParams.sort_field === "name" &&
                                                        (queryParams.sort_direction === "asc" ? <MoveUp className="w-4" /> : <MoveDown className="w-4" />)}
                                                </div>
                                            </th>
                                            <th className="px-4 py-2 text-gray-600 dark:text-gray-300">Contacts</th>
                                            <th className="px-4 py-2 text-gray-600 dark:text-gray-300">Category</th>
                                            <th className="px-4 py-2 text-gray-600 dark:text-gray-300">Created By</th>
                                            <th
                                                onClick={() => sortChanged("created_at")}
                                                className="px-4 py-2 text-gray-600 dark:text-gray-300 cursor-pointer"
                                            >
                                                <div className="flex items-center gap-1">
                                                    Date Created
                                                    {queryParams.sort_field === "created_at" &&
                                                        (queryParams.sort_direction === "asc" ? <MoveUp className="w-4" /> : <MoveDown className="w-4" />)}
                                                </div>
                                                
                                                
                                            </th>
                                            <th className="px-4 py-2 text-gray-600 dark:text-gray-300">Payout status</th>
                                            <th className="px-4 py-2 text-gray-600 dark:text-gray-300">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {model.data.map((item) => (
                                            <tr key={item.id} className="border-b border-gray-100 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                <td className="px-4 py-2">{item.name}</td>
                                                <td className="px-4 py-2">{item.description}</td>
                                                <td className="px-4 py-2">{item.region.name}</td>
                                                <td className="px-4 py-2">{item.createdBy.name}</td>
                                                <td className="px-4 py-2">{dayjs(item.createdAt).format("MMMM D, YYYY")}</td>
                                                <td className="px-4 py-2">{item.region.description}</td>
                                                
                                                <td className="px-4 py-2">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => setDialogConfig({ open: true, process: "view", data: item })}
                                                            className="px-2 py-1 text-blue-600 hover:bg-blue-200 rounded"
                                                        >
                                                            <Eye className="inline-block w-4 mr-1" /> View
                                                        </button>
                                                        <button
                                                            onClick={() => setDialogConfig({ open: true, process: "update", data: item })}
                                                            className="px-2 py-1 text-green-600 hover:bg-green-200 rounded"
                                                        >
                                                            <Pencil className="inline-block w-4 mr-1" /> Update
                                                        </button>
                                                        <button
                                                            onClick={() => setDialogConfig({ open: true, process: "delete", data: item })}
                                                            className="px-2 py-1 text-red-600 hover:bg-red-200 rounded"
                                                        >
                                                            <Trash2 className="inline-block w-4 mr-1" /> Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <div className="p-4 dark:bg-gray-600 bg-green-500 rounded-b-lg">
                                    <PaginationEx links={model.links} meta={model.meta} onLoading={() => setLoading(true)} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Dialog open={dialogConfig.open} onOpenChange={onDialogConfig}>
                    <DialogContent className="sm:max-w-[425px] dark:bg-gray-800 text-gray-900 dark:text-gray-100 dark:border-none">
                        <DialogHeader>
                            <DialogTitle>{titleCase(dialogConfig.process + " " + resourceName)}</DialogTitle>
                        </DialogHeader>
                        <Separator className="h-[1px] mb-4 bg-slate-500" />
                        {dialogConfig.process === "view" && <Show model={dialogConfig.data} onDialogConfig={onDialogConfig} />}
                        {dialogConfig.process === "update" && <Update model={dialogConfig.data} regions={regions} onDialogConfig={onDialogConfig} params={queryParams} />}
                        {dialogConfig.process === "delete" && <Delete model={dialogConfig.data} onDialogConfig={onDialogConfig} params={queryParams} />}
                    </DialogContent>
                </Dialog>
            </div>
        </AuthenticatedLayout>
    );
}
