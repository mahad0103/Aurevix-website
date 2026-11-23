
const ok =
  window.AUREVIX_SUPABASE_URL &&
  window.AUREVIX_SUPABASE_ANON_KEY &&
  !window.AUREVIX_SUPABASE_URL.includes("YOUR-PROJECT") &&
  !window.AUREVIX_SUPABASE_ANON_KEY.includes("YOUR_");

const status = document.getElementById("dashboard-status");
const content = document.getElementById("dashboard-content");

if (!ok || !window.supabase) {
  status.textContent = "Admin backend is not configured.";
} else {
  const db = window.supabase.createClient(
    window.AUREVIX_SUPABASE_URL,
    window.AUREVIX_SUPABASE_ANON_KEY
  );

  let editingId = null;

  const form = document.getElementById("post-form");
  const list = document.getElementById("posts-list");

  // Create Cancel Edit button
  const cancelBtn = document.createElement("button");
  cancelBtn.type = "button";
  cancelBtn.textContent = "Cancel Edit";
  cancelBtn.className = "btn btn-ghost";
  cancelBtn.style.display = "none";
  form.appendChild(cancelBtn);

  const saveBtn = form.querySelector('button[type="submit"]');

  function resetForm() {
    editingId = null;
    form.reset();
    document.getElementById("post-published").checked = true;
    saveBtn.textContent = "Save article ↗";
    cancelBtn.style.display = "none";
    form.closest(".admin-panel").querySelector("h2").textContent =
      "Write a new article";
  }

  cancelBtn.addEventListener("click", resetForm);

  async function loadPosts() {
    const { data, error } = await db
      .from("posts")
      .select("id,title,category,summary,content,published,created_at")
      .order("created_at", { ascending: false });

    if (error) {
      list.textContent = error.message;
      return;
    }

    list.innerHTML = "";

    (data || []).forEach((p) => {
      const row = document.createElement("div");
      row.className = "admin-post";

      const label = document.createElement("span");
      label.textContent =
        p.title + " · " + p.category + " · " +
        (p.published ? "Published" : "Draft");

      // Edit button
      const edit = document.createElement("button");
      edit.textContent = "Edit";
      edit.className = "btn btn-ghost";

      edit.onclick = () => {
        editingId = p.id;

        document.getElementById("post-title").value = p.title;
        document.getElementById("post-category").value = p.category;
        document.getElementById("post-summary").value = p.summary;
        document.getElementById("post-content").value = p.content;
        document.getElementById("post-published").checked = p.published;

        saveBtn.textContent = "Update article";
        cancelBtn.style.display = "inline-block";

        form.closest(".admin-panel").querySelector("h2").textContent =
          "Edit article";

        form.scrollIntoView({ behavior: "smooth" });
      };

      // Delete button
      const del = document.createElement("button");
      del.className = "danger";
      del.textContent = "Delete";

      del.onclick = async () => {
        if (confirm("Delete this article?")) {
          const { error } = await db
            .from("posts")
            .delete()
            .eq("id", p.id);

          if (error) {
            alert(error.message);
          } else {
            loadPosts();
          }
        }
      };

      row.append(label, edit, del);
      list.append(row);
    });

    if (!data?.length) {
      list.textContent = "No articles yet.";
    }
  }

  // Save new article OR update existing article
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      title: document.getElementById("post-title").value.trim(),
      category: document.getElementById("post-category").value.trim(),
      summary: document.getElementById("post-summary").value.trim(),
      content: document.getElementById("post-content").value.trim(),
      published: document.getElementById("post-published").checked
    };

    let error;

    if (editingId !== null) {
      const result = await db
        .from("posts")
        .update(payload)
        .eq("id", editingId);

      error = result.error;
    } else {
      const result = await db
        .from("posts")
        .insert(payload);

      error = result.error;
    }

    if (error) {
      alert(error.message);
      return;
    }

    alert(editingId !== null
      ? "Article updated successfully!"
      : "Article uploaded successfully!");

    resetForm();
    await loadPosts();
  });

  // Logout
  document.getElementById("logout").onclick = async () => {
    await db.auth.signOut();
    location.href = "admin.html";
  };

  // Check login
  (async () => {
    const { data: { session } } = await db.auth.getSession();

    if (!session) {
      location.href = "admin.html";
      return;
    }

    status.textContent = "Signed in. Loading posts…";
    content.classList.remove("hidden");

    await loadPosts();
  })();
}
