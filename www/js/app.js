
 var MC = monaca.cloud;
 
//function onRegisterBtn(){
 $(document).on('click', '#RegisterBtn', function(){
  
  var email = $("#reg_email").val();
  
  //email check
  if (!email.match(/^[A-Za-z0-9]+[\w-]+@[\w\.-]+\.\w{2,}$/)){
    alert("e-mailアドレスをご確認ください。");
	return false;
    }
  
  var password = $("#reg_password").val();
 
  MC.User.register(email, password)
    .done(function()
    {
      var oid = monaca.cloud.User._oid;
      MC.Mailer.sendMail(oid, "saiyou")
       .done( function(){ console.log('send mail') } );
      console.log('Registration is success!');      
      $.mobile.changePage('#ListPage');
    })
    .fail(function(err)
    {
      console.log(err.text);
      console.log('Registration failed!');
    });
//}
});

//function onLoginBtn(){
 $(document).on('click', '#LoginBtn', function(){

  var email = $("#login_email").val();
  var password = $("#login_password").val();

  MC.User.login(email, password)
    .done(function()
    {
      console.log('Login is success!');
      $.mobile.changePage('#ListPage');
       getMemoList();
    })
    .fail(function(err)
    {
      console.log(err.message);
      alert('Login failed!');
    });
//}
});


function getMemoList(){
  console.log('Refresh List');
  var memo = MC.Collection("Memo");
  memo.findMine()
    .done(function(items, totalItems)
    {
      $("#ListPage #TopListView").empty();
      var list = items.items;

      for (var i in list)
      {
        var memo = list[i];
        var d = new Date(memo._createdAt);
        var date = d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate();
        $li = $("<li><a href='javascript:onShowLink(\"" + memo._id + "\",\"" + memo.title + "\",\"" + memo.content + "\")' class='show'><h3></h3><p></p></a><a href='javascript:onDeleteBtn(\"" + memo._id + "\")' class='delete'>Delete</a></li>");
        $li.find("h3").text(date);
        $li.find("p").text(memo.title);
        $("#TopListView").prepend($li);
      }
      if (list.length == 0) {
        $li = $("<li>No memo found</li>");
        $("#TopListView").prepend($li);
      }
      $("#ListPage #TopListView").listview("refresh");
    })
  .fail(function(err){ alert('failed to find the collection' + err.text); return null; });
}

//function onLogoutBtn(){
 $(document).on('click', '#LogoutBtn', function(){
  MC.User.logout()
    .done(function()
    {
      console.log('Logout is success!');
      $.mobile.changePage('#LoginPage');
    })
    .fail(function(err)
    {
      console.log(err.message);
      alert('Logout failed!');
    });
//}
});

//function onSaveBtn(){
$(document).on('click', '#SaveBtn', function(){
  var title = $("#title").val();
  var content = $("#content").val();
  if (title != '')
  {
    addMemo(title,content);
  }
//}
 });

function addMemo(title,content) {
  var memo = MC.Collection("Memo");
  memo.insert({ title: title, content: content})
  .done(function(insertedItem)
  {
    console.log('Insert is success!');
    $("#title").val("");
    $("#content").val("");
    $.mobile.changePage('#ListPage');
      getMemoList();
    //display a dialog stating that the inserting is success
    $( "#okDialog_add" ).popup("open", {positionTo: "origin"}).click(function(event)
    {
      event.stopPropagation();
      event.preventDefault();
      getMemoList();
      $.mobile.changePage('#ListPage');
      getMemoList();
    });
  })
  .fail(function(err){ console.log('Insert failed!');})
}


//function onUpdateBtn(){
$(document).on('click', '#UpdateBtn', function(){
  var new_title = $("#editTitle").val();
  console.log(new_title);
  var new_content = $("#editContent").val();
   console.log(new_content);
  var id = $("#editlId").text();
   console.log(id);
  
 // var id = currentMemoID;
  if (new_title != '') {
    editMemo(id, new_title, new_content);
  }
//}
});

function editMemo(id, new_title, new_content){
//$(document).on('click', '#editMemo', function(){
  //   $.mobile.changePage("#EditPage");
  //   console.log('Edit Page');
  var memo = MC.Collection("Memo");
  memo.findMine(MC.Criteria("_id==?", [id]))
    .done(function(items, totalItems)
    {
      items.items[0].title = new_title;
      items.items[0].content = new_content;
      items.items[0].update()
        .done(function(updatedItem)
        {
          console.log('Updating is success!');
          //display a dialog stating that the updating is success
          $( "#okDialog_edit" ).popup("open", {positionTo: "origin"}).click(function(event)
          {
            event.stopPropagation();
            event.preventDefault();
            getMemoList();
            location.href='#ListPage';
          });
        })
        .fail(function(err){ console.log(JSON.stringify(err)); return null; });
    })
    .fail(function(err){ console.log(JSON.stringify(err)); return null; });
}
//});


function onDeleteBtn(id){
  currentMemoID = id;
  $( "#yesNoDialog_delete" ).popup("open", {positionTo: "origin"});
}

//function deleteMemo() {
$(document).on('click', '#deleteMemo', function(){
  var memo = MC.Collection("Memo");
  memo.findMine(MC.Criteria("_id==?", [currentMemoID]))
    .done(function(items, totalItems)
    {
      items.items[0].delete();
      console.log('The memo is deleted!');
      getMemoList();
      $.mobile.changePage("#ListPage");
    })
    .fail(function(err){ console.log(JSON.stringify(err)); return null; });
//}
});

function onShowLink(id, new_title, new_content){
    $("#clTitle").html(new_title);
    $("#clContent").html(new_content);
    $("#clId").text(id);
    var sq = $("#clId").text();
    console.log(sq);

    $("#editTitle").text(new_title);
    $("#editContent").text(new_content);
    $("#editlId").text(id);

    $.mobile.changePage('#ShowPage');
}

//function memoEdit(id, new_title, new_content){
$(document).on('click', '#memoEdit', function() {
    $.mobile.changePage("#EditPage");
    console.log('Edit Page');
    var ss =  $("#editlId").text();
    console.log(ss);
//}
});