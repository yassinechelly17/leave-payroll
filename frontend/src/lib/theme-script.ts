/** Inline before React hydrates — avoids light/dark flash. */
export const THEME_STORAGE_KEY = "leave-payroll-theme";

export const themeInitScript = `(function(){
  try {
    var k="${THEME_STORAGE_KEY}";
    var t=localStorage.getItem(k);
    var r=document.documentElement;
    if(t==="light"){r.classList.remove("dark");}
    else if(t==="dark"){r.classList.add("dark");}
    else if(window.matchMedia("(prefers-color-scheme: dark)").matches){r.classList.add("dark");}
    else{r.classList.remove("dark");}
  } catch(e) {
    document.documentElement.classList.add("dark");
  }
})();`;
