
"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Option {
  label: string
  value: string
}

interface MultiSelectProps {
  options: Option[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  disabled?: boolean
  maxItems?: number
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select items...",
  searchPlaceholder = "Search...",
  emptyText = "No items found",
  disabled = false,
  maxItems,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')

  const handleUnselect = (item: string) => {
    onChange(value.filter((i) => i !== item))
  }

  const handleSelect = (item: string) => {
    if (value.includes(item)) {
      handleUnselect(item)
    } else if (!maxItems || value.length < maxItems) {
      onChange([...value, item])
    }
  }

  const selectedOptions = options.filter((option) => (value || []).includes(option.value))

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            !value.length && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          {value.length > 0 ? (
            <div className="flex gap-1 flex-wrap">
              {selectedOptions.slice(0, 2).map((option) => (
                <Badge
                  variant="secondary"
                  key={option.value}
                  className="mr-1 mb-1"
                >
                  {option.label}
                </Badge>
              ))}
              {value.length > 2 && (
                <Badge variant="secondary" className="mr-1 mb-1">
                  +{value.length - 2} more
                </Badge>
              )}
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <div className="p-2">
          <input
            className="w-full rounded-md border px-3 py-2 text-sm outline-none"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="max-h-60 overflow-y-auto">
          {options.filter(opt => opt.label.toLowerCase().includes(search.toLowerCase())).length === 0 ? (
            <div className="p-3 text-sm text-muted-foreground">{emptyText}</div>
          ) : (
            <div className="p-1">
              {options.filter(opt => opt.label.toLowerCase().includes(search.toLowerCase())).map((option) => {
                const selected = value.includes(option.value)
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      "w-full flex items-center justify-start gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent",
                      selected ? 'bg-accent/20' : ''
                    )}
                  >
                    <Check className={cn('h-4 w-4', selected ? 'opacity-100' : 'opacity-0')} />
                    <span className="flex-1 text-left">{option.label}</span>
                    {maxItems && selected && (
                      <X
                        className="ml-2 h-4 w-4 text-muted-foreground hover:text-foreground"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleUnselect(option.value)
                        }}
                      />
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
