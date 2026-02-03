import { cloneTemplate } from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
  const { tableTemplate, rowTemplate, before, after } = settings;
  const root = cloneTemplate(tableTemplate);

  // @todo: #1.2 —  вывести дополнительные шаблоны до и после таблицы

  after.forEach((subName) => {
    // перебираем нужный массив идентификаторов
    root[subName] = cloneTemplate(subName); // клонируем и получаем объект, сохраняем в таблице
    root.container.append(root[subName].container); // добавляем к таблице после (append) или до (prepend)
  });
  before.reverse().forEach((subName) => {
    root[subName] = cloneTemplate(subName);
    root.container.prepend(root[subName].container);
  });

  // @todo: #1.3 —  обработать события и вызвать onAction()
  root.container.addEventListener("change", () => {
    onAction(); // важно: вызываем, а не передаём ссылку
  });

  root.container.addEventListener("reset", () => {
    setTimeout(onAction); // без скобок: setTimeout сам вызовет onAction чуть позже
  });

  root.container.addEventListener("submit", (e) => {
    e.preventDefault();
    onAction(e.submitter); // передаём кнопку/элемент, который сабмитнул форму
  });

  const render = (data) => {
    // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
    const nextRows = data.map((item) => {
      const row = cloneTemplate(rowTemplate);
      Object.keys(item).forEach((key) => {
        if (row.elements[key]) {
          row.elements[key].textContent = item[key];
        }
      });
      return row.container
    });
    root.elements.rows.replaceChildren(...nextRows);
  };

  return { ...root, render };
}
