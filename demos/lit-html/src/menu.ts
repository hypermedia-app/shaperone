export interface Menu {
  id?: string
  type?: 'layout' | 'renderer' | 'format' | 'components' | 'editorChoice'
  text?: string
  checked?: boolean
  children?: Menu[]
  component?: string | HTMLElement
}

export function updateMenu(menu: Menu, type: Menu['type'], text: string | undefined): Menu {
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

export function updateComponent(menu: Menu, id: string, newComponent: string | HTMLElement): Menu {
  let { component } = menu
  if (menu.id === id) {
    component = newComponent
  }

  return {
    ...menu,
    component,
    children: menu.children?.map(child => updateComponent(child, id, newComponent)),
  }
}
