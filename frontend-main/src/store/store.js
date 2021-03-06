/**
 * Im Store können wir globale reaktive Daten erstellen, die von überall in unserem Projekt verfügbar sind.
 * - stateSymbol ist der Key für unsere Daten
 * - createState erstellt unsere Daten
 * - useState greift über das stateSymbol in anderen Dateien auf unsere Daten zu
 * - provideSate Stellt unsere Daten und den Key global zur verfügung
 * in unserer Main wird unser store global zugänglich gemacht
 * um Daten des Typ State zu verwenden, muss in der entsprechenden Datei useState aus store.js importiert werden.
 * Anschließend kann man mittels let state = useState auf das stateObjekt zugreifen und es lesen/verndern.
 */
import { reactive, provide, inject } from 'vue'
import User from '../models/User'

export const stateSymbol = Symbol('state')
export const createState = () => reactive({ counter: 0, user: new User(), selectedTaskObject: null, taskId: 0, component: null, plugin: { label: 'Grade', code: 'gradeDemo', path: 'components/Plugins/Grade/resolve.vue' }, availablePlugins: {} })

export const useState = () => inject(stateSymbol)
export const provideState = () => provide(
  stateSymbol,
  createState()
)
