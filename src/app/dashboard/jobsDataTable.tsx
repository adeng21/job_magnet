"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CompanyJob } from "@/companyjob";
import Image from "next/image";
import Link from "next/link";

interface DataTableProps<TData> {
  data: TData[];
}

const columns: ColumnDef<CompanyJob>[] = [
  {
    accessorKey: "Company.name",
    header: "Company",
    cell: ({ row }) => {
      return (
        <Image
          alt="company name"
          width={60}
          height={60}
          src={`/assets/${row.original.Company.name}.jpg`}
        />
      );
    },
  },
  {
    accessorKey: "title",
    header: "Role",
    cell: ({ row }) => {
      return (
        <Link href={row.original.url} target="_blank">
          <div className="font-semibold hover:underline">
            {row.original.title}
          </div>
        </Link>
      );
    },
  },
  {
    accessorKey: "location",
    header: "Location",
  },
];

export function JobsDataTable<TData>({ data }: DataTableProps<TData>) {
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
