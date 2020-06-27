export interface Menu {
  type?: 'layout' | 'renderer' | 'format'
  text: string
  checked?: boolean
  children?: Menu[]
}

export function updateMenu(menu: Menu, type: Menu['type'], text: string): Menu {
  let { checked } = menu
  if (menu.type === type) {
    checked = menu.text === text
  }

  return {
    ...menu,
    checked,
    children: menu.children?.map(child => updateMenu(child, type, text)),
  }
}
