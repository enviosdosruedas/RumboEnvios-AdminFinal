import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle2, MoreHorizontal, Package, PlusCircle, Search, Truck, XCircle } from "lucide-react"

const shipments = [
  {
    id: "RE-789012",
    customer: {
      name: "Juan Pérez",
      avatar: "https://placehold.co/32x32.png",
      fallback: "JP",
    },
    date: "2024-05-20",
    status: "Delivered",
  },
  {
    id: "RE-456789",
    customer: {
      name: "Maria García",
      avatar: "https://placehold.co/32x32.png",
      fallback: "MG",
    },
    date: "2024-05-22",
    status: "In Transit",
  },
  {
    id: "RE-123456",
    customer: {
      name: "Carlos Sanchez",
      avatar: "https://placehold.co/32x32.png",
      fallback: "CS",
    },
    date: "2024-05-23",
    status: "Pending",
  },
  {
    id: "RE-345678",
    customer: {
      name: "Ana Martinez",
      avatar: "https://placehold.co/32x32.png",
      fallback: "AM",
    },
    date: "2024-05-24",
    status: "In Transit",
  },
  {
    id: "RE-901234",
    customer: {
      name: "Lucia Fernandez",
      avatar: "https://placehold.co/32x32.png",
      fallback: "LF",
    },
    date: "2024-05-21",
    status: "Cancelled",
  },
    {
    id: "RE-567890",
    customer: {
      name: "David Rodriguez",
      avatar: "https://placehold.co/32x32.png",
      fallback: "DR",
    },
    date: "2024-05-25",
    status: "Delivered",
  },
];


const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'Delivered':
      return <Badge variant="outline" className="border-green-600 text-green-600"><CheckCircle2 className="mr-1 h-3 w-3" />{status}</Badge>
    case 'In Transit':
      return <Badge variant="default" className="bg-primary/80 hover:bg-primary/90"><Truck className="mr-1 h-3 w-3" />{status}</Badge>
    case 'Pending':
      return <Badge variant="secondary">{status}</Badge>
    case 'Cancelled':
      return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" />{status}</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function Home() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <header className="flex h-16 items-center justify-between gap-4 border-b bg-card px-4 md:px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </div>
        <div className="flex flex-1 items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <form className="ml-auto flex-1 sm:flex-initial">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search shipments..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              />
            </div>
          </form>
          <Button style={{backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))'}} className="hover:opacity-90">
            <PlusCircle className="mr-2 h-5 w-5" />
            New Shipment
          </Button>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,254</div>
              <p className="text-xs text-muted-foreground">+5.2% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Transit</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">128</div>
              <p className="text-xs text-muted-foreground">Currently on the move</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delivered</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">980</div>
              <p className="text-xs text-muted-foreground">+12.1% from last month</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32</div>
              <p className="text-xs text-muted-foreground">-2% from last month</p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Shipments</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tracking ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shipments.map((shipment) => (
                    <TableRow key={shipment.id}>
                      <TableCell className="font-medium">{shipment.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={shipment.customer.avatar} alt={shipment.customer.name} data-ai-hint="person portrait" />
                            <AvatarFallback>{shipment.customer.fallback}</AvatarFallback>
                          </Avatar>
                          <span>{shipment.customer.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{shipment.date}</TableCell>
                      <TableCell>
                        <StatusBadge status={shipment.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Track Shipment</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
