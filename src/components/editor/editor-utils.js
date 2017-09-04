import { QBtn, QBtnToggle, QBtnDropdown, QBtnGroup } from '../btn'
import { QTooltip } from '../tooltip'
import { QList, QItem, QItemMain } from '../list'

function getBtn (h, vm, btn) {
  const child = []
  if (btn.tip) {
    const Key = btn.key
      ? h('div', [h('small', `(CTRL + ${String.fromCharCode(btn.key)})`)])
      : null
    child.push(h(QTooltip, { props: {delay: 1000} }, [btn.tip, Key]))
  }

  if (btn.type === 'toggle') {
    return h(QBtnToggle, {
      props: {
        icon: btn.icon,
        label: btn.label,
        toggled: vm.attrib[btn.test || btn.cmd],
        toggleColor: 'primary'
      },
      on: {
        click () {
          vm.runCmd(btn.cmd, btn.param)
        }
      }
    }, child)
  }
  else if (btn.type === 'execute') {
    return h(QBtn, {
      props: {
        icon: btn.icon,
        label: btn.label,
        disable: btn.disable ? btn.disable(vm) : false
      },
      on: {
        click () {
          vm.runCmd(btn.cmd, btn.param)
        }
      }
    }, child)
  }
  else if (Array.isArray(btn)) {
    let sel = ''

    const Items = btn.map(item => {
      const active = vm.attrib[item.test || item.cmd]
      if (active) {
        sel = item.tip
      }
      return h(QItem, {props: {active}}, [
        h(QItemMain, {
          props: {
            label: item.tip
          },
          on: {
            click () {
              instance.componentInstance.close()
              vm.$refs.content.focus()
              vm.caret.restore()
              vm.runCmd(item.cmd, item.param)
            }
          }
        })
      ])
    })

    const instance = h(QBtnDropdown, { props: { noCaps: true, noWrap: true, label: sel } }, [
      h(QList, { props: { link: true, separator: true } }, [
        Items
      ])
    ])
    return instance
  }
}

export function getToolbar (h, vm) {
  return vm.buttons.map(group => h(
    QBtnGroup,
    group.map(btn => getBtn(h, vm, btn))
  ))
}