import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'
import { Toaster } from "@/components/ui/toaster"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar'
import { Home, Package, Users, Settings, Ship } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'RumboEnvios Admin',
  description: 'Admin dashboard for RumboEnvios',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <SidebarProvider>
          <Sidebar>
            <SidebarHeader>
              <div className="flex items-center gap-2.5">
                <Button variant="ghost" size="icon" className="shrink-0 rounded-lg bg-primary/10 text-primary hover:bg-primary/20">
                  <Ship size={20}/>
                </Button>
                <div className="flex flex-col">
                  <h2 className="text-base font-semibold tracking-tight">RumboEnvios</h2>
                  <p className="text-xs text-muted-foreground">Admin Panel</p>
                </div>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive>
                    <Link href="/">
                      <Home />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="#">
                      <Package />
                      <span>Shipments</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="#">
                      <Users />
                      <span>Customers</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                   <SidebarMenuButton asChild>
                    <Link href="#">
                      <Settings />
                      <span>Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
               <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Avatar className="size-8">
                      <AvatarImage src="https://placehold.co/40x40.png" alt="@admin" data-ai-hint="profile picture" />
                      <AvatarFallback>RA</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Admin User</span>
                      <span className="text-xs text-muted-foreground">admin@rumbo.com</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>
          <SidebarInset>
            {children}
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
