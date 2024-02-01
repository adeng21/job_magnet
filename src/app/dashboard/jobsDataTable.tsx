"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { locationSanitizer } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CompanyJob } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useState, useOptimistic } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { ArchiveIcon, XCircle } from "lucide-react";
import {
  markCompanyJobNotInterested,
  updateApplicationStatus,
} from "@/mutations";
import { ApplicationStatus } from "@prisma/client";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";

interface DataTableProps<TData> {
  data: CompanyJob[];
}

type RemoveFromFilteredDataType = (jobId: number) => void;

const getColumns = (removeFromFilteredData: RemoveFromFilteredDataType) => [
  {
    accessorKey: "Company.name",
    header: "Company",
    cell: ({ row }: any) => {
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
    cell: ({ row }: any) => {
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
    cell: ({ row }: any) => {
      return (
        <div className="font-semibold">
          {locationSanitizer(row.original.location)}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Application Status",
    cell: ({ row }: any) => {
      const status = row.original.UserCompanyJobStatus[0]?.applicationStatus;
      return (
        <Select
          onValueChange={(e) =>
            updateApplicationStatus(
              row.original.id,
              Object.values(ApplicationStatus).find((status) => status === e)
            )
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder={status ? status : "..."} />
          </SelectTrigger>
          <SelectContent>
            {Object.values(ApplicationStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorKey: "interested",
    header: "Not Interested?",
    cell: ({ row }: any) => {
      return (
        <ArchiveIcon
          onClick={() => {
            removeFromFilteredData(row.original.id);
            markCompanyJobNotInterested(row.original.id);
          }}
          className="h-6 w-6 text-red-400 hover:text-gray-600 cursor-pointer"
        />
      );
    },
  },
];

const tabs = [
  {
    name: "Recent",
    filter: (job: CompanyJob) => {
      const date = new Date();
      date.setDate(date.getDate() - 7);
      return new Date(job.createdAt) > date;
    },
  },
  {
    name: "Interested",
    filter: (job: CompanyJob) =>
      job.UserCompanyJobStatus[0]?.applicationStatus === "TO_APPLY",
  },
  {
    name: "Applied",
    filter: (job: CompanyJob) =>
      job.UserCompanyJobStatus[0]?.applicationStatus === "APPLIED",
  },
  {
    name: "Interviewing",
    filter: (job: CompanyJob) =>
      job.UserCompanyJobStatus[0]?.applicationStatus === "INTERVIEWING",
  },
  {
    name: "Offer",
    filter: (job: CompanyJob) =>
      job.UserCompanyJobStatus[0]?.applicationStatus === "OFFER",
  },
  {
    name: "Rejected",
    filter: (job: CompanyJob) =>
      job.UserCompanyJobStatus[0]?.applicationStatus === "REJECTED",
  },
  {
    name: "All",
    filter: () => true,
  },
];

export function JobsDataTable<TData>({ data }: DataTableProps<TData>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [filteredData, setFilteredData] = useState<CompanyJob[]>(data);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [locationFilter, setLocationFilter] = useState<string>("");
  const uniqueLocations = [
    ...new Set(
      data
        .map((job) => locationSanitizer(job.location))
        .filter((item) => item !== null && item !== "")
    ),
  ];

  const removeFromFilteredData = (jobId: number) => {
    const index = filteredData.findIndex((job) => job.id === jobId);
    const newData = [...filteredData];
    newData.splice(index, 1);
    setFilteredData(newData);
  };

  const columns = getColumns(removeFromFilteredData);

  const table = useReactTable({
    columns,
    data: filteredData,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  const locationColumn = table.getColumn("location");
  const updateLocationFilter = (location: string) => {
    setLocationFilter(location);
    locationColumn?.setFilterValue(location);
  };

  return (
    <div>
      <div className="flex items-center py-4 bg-white shadow-md rounded-lg my-6">
        <Select
          value={locationFilter}
          onValueChange={(e) => updateLocationFilter(e)}
        >
          <SelectTrigger className="mx-4 px-4 w-[180px]">
            <SelectValue placeholder="Filter by location" />
          </SelectTrigger>
          <SelectContent>
            {uniqueLocations.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {locationColumn?.getFilterValue() ? (
          <XCircle
            onClick={() => updateLocationFilter("")}
            className="text-red-400 hover:text-red-600"
          ></XCircle>
        ) : null}
      </div>
      <Tabs defaultValue={activeTab.name}>
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.name}
              value={tab.name}
              onClick={() => setActiveTab(tab)}
            >
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="bg-white shadow-md rounded-lg p-6">
          <TabsContent value={activeTab.name}>
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
                  table
                    .getRowModel()
                    .rows.filter((row) => activeTab.filter(row.original))
                    .map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
