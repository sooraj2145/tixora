export type Category = 'Music' | 'Tech' | 'Comedy' | 'Theatre'
export type Filter = 'All' | Category

export interface EventItem {
  id: number
  title: string
  category: Category
  month: string
  day: string
  venue: string
  city: string
  price: number
}