# Plugins

A low-level feature allows adding custom functionality directly to the state store. This attaches directly to the 
[rdx](https://github.com/CaptainCodeman/rdx) library and allows full access to action invoked on the store.

## Setup

Use `addPlugin` to have it added to the store. Make sure to call this before a form is initialised on a page.

```js
import { addPlugin } from '@hydrofoil/shaperone-core/store'

const loggerPlugin = {
  // a plugin can have its own state
  model: {
    state: { enabled: false },
    reducers: {
      toggle(state) {
        return { ...state, enabled: !state.enabled }   
      }      
    },
    // and (async) effects which listen and call other models, or do fancy stuff
    effects(store) {
      const dispatch = store.getDispatch()
        
      return {
        'forms/initObjectValue'(arg) {
          console.log('Initialized property', arg)
          
          dispatch.forms.updateComponentState({
            ...arg,
            newState: {
              observed: true
            }
          })
        }
      }
    }
  }
}

addPlugins({
  loggerPlugin
})
```

## See more

Unfortunately, the plugin feature is not well documented. See the built-in plugins for inspiration: [effects](https://github.com/CaptainCodeman/rdx/blob/master/src/effectsPlugin.ts),
[routing](https://github.com/CaptainCodeman/rdx/blob/master/src/routingPlugin.ts)
