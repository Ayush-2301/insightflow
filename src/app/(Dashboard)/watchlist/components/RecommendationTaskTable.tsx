"use client";
import { RecommendedTask } from "@/lib/types";
import React, { useCallback, useMemo, useState } from "react";
import {
  Tabs,
  Panel,
  DragTabList,
  PanelList,
  helpers,
  Tab,
} from "@react-tabtab-next/tabtab";
import * as Style from "./tabTheme";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Calendar,
  CircleCheck,
  Component,
  LucideIcon,
  Plus,
  Shapes,
  Wand2,
} from "lucide-react";
import Table from "@/components/Table";

export type GroupProp = {
  value: string;
  label: string;
  icon: LucideIcon;
};
const groups: GroupProp[] = [
  {
    value: "all",
    label: "All",
    icon: CircleCheck,
  },
  {
    value: "domain",
    label: "By Domain",
    icon: Component,
  },
  {
    value: "category",
    label: "By Category",
    icon: Shapes,
  },
  {
    value: "clarity",
    label: "By Clarity",
    icon: Wand2,
  },
  {
    value: "createdAt",
    label: "By Created",
    icon: Calendar,
  },
];

const makeData = (title: string, icon: LucideIcon, useTitleCounter = true) => {
  return [
    {
      title: useTitleCounter ? `${title} ` : title,
      icon,
      content: (
        <div>
          <b>Content </b>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias
            assumenda laudantium natus voluptatibus necessitatibus totam autem
            dignissimos. Sequi ratione ea, esse magnam excepturi perferendis
            commodi est sed voluptatum unde officia!
          </p>
        </div>
      ),
    },
  ];
};

const RecommendationTaskTable = ({
  recommendedTask,
}: {
  recommendedTask: RecommendedTask[];
}) => {
  const [open, setOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<GroupProp>({
    value: "all",
    label: "All",
    icon: CircleCheck,
  });
  const [activeTab, setActiveTab] = useState(0);
  const [tabs, setTabs] = useState(makeData("All", CircleCheck, false));

  const closableTabItems = useMemo(() => {
    return tabs.map((tab, index) => {
      const isAllTab = tab.title.trim() === "All";
      const Icon = tab.icon;
      return (
        <Tab
          closable={
            !(
              isAllTab &&
              tabs.filter((t) => t.title.trim() === "All").length === 1
            )
          }
          key={index}
        >
          {tab.title}
        </Tab>
      );
    });
  }, [tabs]);

  const panelItems = useMemo(() => {
    return tabs.map((tab, index) => {
      return (
        <Panel key={index}>
          <Table group={selectedGroup} />
        </Panel>
      );
    });
  }, [tabs]);

  const handleOnTabSequenceChange = useCallback(
    ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
      console.log({ oldIndex, newIndex });
      setTabs((tabs) => helpers.simpleSwitch(tabs, oldIndex, newIndex));
      setActiveTab(newIndex);
    },
    []
  );

  const handleOnTabChange = useCallback((i: number) => {
    console.log("select tab", i);
    setActiveTab(i);
  }, []);

  const handleTabClose = useCallback(
    (index: number) => {
      setTabs((prevTabs) => {
        const newTabs = prevTabs.filter((_, idx) => idx !== index);
        const allTabsCount = newTabs.filter(
          (tab) => tab.title.trim() === "All"
        ).length;
        if (allTabsCount === 0) {
          newTabs.push({
            title: "All",
            icon: CircleCheck,
            content: (
              <div>
                <b>Content </b>
                <p>Grouped by All</p>
              </div>
            ),
          });
        }
        if (index === activeTab) {
          setActiveTab((prev) => (prev > 0 ? prev - 1 : 0));
        } else if (index < activeTab) {
          setActiveTab((prev) => prev - 1);
        }
        return newTabs;
      });
    },
    [activeTab]
  );

  const handleAddTab = useCallback(
    (status: GroupProp) => {
      setTabs((prev) => {
        const newTabs = [...prev];
        const newItem = {
          title: status.label,
          icon: status.icon,
          content: (
            <div>
              <b>Content </b>
              <p>Grouped by {status.label}</p>
            </div>
          ),
        };
        newTabs.push(newItem);
        return newTabs;
      });
      setActiveTab(tabs.length);
    },
    [tabs.length]
  );

  return (
    <div>
      <Tabs
        onTabClose={handleTabClose}
        customStyle={Style}
        showModalButton={false}
        activeIndex={activeTab}
        onTabChange={handleOnTabChange}
        onTabSequenceChange={handleOnTabSequenceChange}
        ExtraButton={
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="">
                <Plus className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" side="right" align="start">
              <Command>
                <CommandInput placeholder="Group By..." />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {groups.map((group) => (
                      <CommandItem
                        className="cursor-pointer"
                        key={group.value}
                        value={group.value}
                        onSelect={(value) => {
                          const selected = groups.find(
                            (s) => s.value === value
                          );
                          if (selected) {
                            handleAddTab(selected);
                          }
                          setOpen(false);
                        }}
                      >
                        <group.icon
                          className={cn(
                            "mr-2 h-4 w-4",
                            group.value === selectedGroup?.value
                              ? "opacity-100"
                              : "opacity-40"
                          )}
                        />
                        <span>{group.label}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        }
      >
        <DragTabList>{closableTabItems}</DragTabList>
        <PanelList>{panelItems}</PanelList>
      </Tabs>
    </div>
  );
};

export default RecommendationTaskTable;
