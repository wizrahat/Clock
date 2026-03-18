import { Alarm } from '@/db/schema'
import { create } from 'zustand'

interface AlarmStore {
  alarms: Alarm[] | null
  setAlarms: (alarms: Alarm[]) => void
  addAlarm: (alarm: Alarm) => void
  updateAlarm: (id: string, changes: Partial<Alarm>) => void
  deleteAlarm: (id: string) => void
}

export const useAlarmStore = create<AlarmStore>((set) => ({
  alarms: null,
  setAlarms: (alarms) => set({ alarms }),
  addAlarm: (alarm) => set((state) => ({
    alarms: state.alarms ? [...state.alarms, alarm] : [alarm]
  })),
  updateAlarm: (id, changes) => set((state) => ({
    alarms: state.alarms?.map((alarm) =>
      alarm.id === id ? { ...alarm, ...changes } : alarm
    )
  })),
  deleteAlarm: (id) => set((state) => ({
    alarms: state.alarms?.filter((alarm) => alarm.id !== id)
  })),
}))
