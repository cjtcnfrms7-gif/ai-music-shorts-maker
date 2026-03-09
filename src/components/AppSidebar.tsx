import { Film, BarChart3, FileText, Settings, Lock } from "lucide-react";
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
  { title: "쇼츠 제작", url: "/", icon: Film, disabled: false },
  { title: "데이터 분석", url: "/analytics", icon: BarChart3, disabled: true },
  { title: "문서 자동화", url: "/docs", icon: FileText, disabled: true },
  { title: "설정", url: "/settings", icon: Settings, disabled: false },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent>
        {/* Logo */}
        <div className="px-4 py-5 border-b border-border">
          {collapsed ? (
            <span className="text-lg font-black text-primary">E</span>
          ) : (
            <div>
              <h1 className="text-xl font-black tracking-tight text-primary">ENTIUS</h1>
              <p className="text-[10px] text-muted-foreground mt-0.5">콘텐츠의 흐름을 바꾸다</p>
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
                      <div className="flex items-center gap-2 opacity-50 cursor-not-allowed px-2 py-2">
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        {!collapsed && (
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-sm">{item.title}</span>
                            <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4 font-medium">
                              준비중
                            </Badge>
                          </div>
                        )}
                      </div>
                    ) : (
                      <NavLink
                        to={item.url}
                        end
                        className="hover:bg-accent/50"
                        activeClassName="bg-accent text-primary font-semibold"
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        {!collapsed && <span className="text-sm">{item.title}</span>}
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
