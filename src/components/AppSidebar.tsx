import { Film, BarChart3, FileText, Settings } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

const menuItems = [
  { title: "쇼츠 제작", url: "/dashboard", icon: Film, disabled: false },
  { title: "데이터 분석", url: "/dashboard/analytics", icon: BarChart3, disabled: true },
  { title: "문서 자동화", url: "/dashboard/docs", icon: FileText, disabled: true },
  { title: "설정", url: "/dashboard/settings", icon: Settings, disabled: false },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
      <SidebarContent>
        {/* Logo */}
        <div className="px-4 py-6 border-b border-sidebar-border">
          {collapsed ? (
            <span className="text-lg font-black text-sidebar-primary font-display">E</span>
          ) : (
            <div>
              <h1 className="text-lg font-black tracking-[-0.02em] text-sidebar-primary font-display">ENTIUS</h1>
              <p className="text-[10px] text-sidebar-foreground/50 mt-0.5 font-body-kr">콘텐츠의 흐름을 바꾸다</p>
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild={!item.disabled} disabled={item.disabled}>
                    {item.disabled ? (
                      <div className="flex items-center gap-2.5 opacity-40 cursor-not-allowed px-2 py-2">
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        {!collapsed && (
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-sm font-body-kr">{item.title}</span>
                            <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4 font-medium font-body-kr">
                              준비중
                            </Badge>
                          </div>
                        )}
                      </div>
                    ) : (
                      <NavLink
                        to={item.url}
                        end
                        className="hover:bg-sidebar-accent/50"
                        activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold"
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        {!collapsed && <span className="text-sm font-body-kr">{item.title}</span>}
                      </NavLink>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
