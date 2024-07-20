"use client";
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
  { value: "all", label: "All", icon: CircleCheck },
  { value: "domain", label: "By Domain", icon: Component },
  { value: "category", label: "By Category", icon: Shapes },
  { value: "clarity", label: "By Clarity", icon: Wand2 },
  { value: "createdAt", label: "By Created", icon: Calendar },
];

const RecommendationTaskTable = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [tabs, setTabs] = useState([
    {
      title: "All",
      icon: CircleCheck,
      content: <Table group={groups[0]} />,
    },
  ]);

  const closableTabItems = useMemo(() => {
    return tabs.map((tab, index) => {
      const isAllTab = tab.title.trim() === "All";

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
          <div className="flex items-center justify-start">
            <tab.icon className="mr-2 h-4 w-4" />
            {tab.title}
          </div>
        </Tab>
      );
    });
  }, [tabs]);

  const panelItems = useMemo(() => {
    return tabs.map((tab, index) => <Panel key={index}>{tab.content}</Panel>);
  }, [tabs]);

  const handleOnTabSequenceChange = useCallback(
    ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
      setTabs((tabs) => helpers.simpleSwitch(tabs, oldIndex, newIndex));
      setActiveTab(newIndex);
    },
    []
  );

  const handleOnTabChange = useCallback((i: number) => {
    setActiveTab(i);
  }, []);

  const handleTabClose = useCallback((index: number) => {
    setTabs((prevTabs) => {
      const newTabs = prevTabs.filter((_, idx) => idx !== index);
      if (!newTabs.find((tab) => tab.title === "All")) {
        newTabs.push({
          title: "All",
          icon: CircleCheck,
          content: <Table group={groups[0]} />,
        });
      }
      setActiveTab((prev) =>
        index === prev ? (prev > 0 ? prev - 1 : 0) : prev
      );
      return newTabs;
    });
  }, []);

  const handleAddTab = useCallback(
    (group: GroupProp) => {
      setTabs((prev) => [
        ...prev,
        {
          title: group.label,
          icon: group.icon,
          content: <Table group={group} />,
        },
      ]);
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
              <Button variant="ghost" size="sm">
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
                        key={group.value}
                        onSelect={() => {
                          handleAddTab(group);
                          setOpen(false);
                        }}
                      >
                        <group.icon className="mr-2 h-4 w-4" />
                        {group.label}
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
