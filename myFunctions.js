/* وظائف التفاعل والتحقق والحسابات باستخدام JavaScript و jQuery */
$(document).ready(function () {
  $(".detailsToggle").on("change", function () {
    $(this).closest("tr").next(".detailsRow").toggle(this.checked);
  });

  $("#continueButton").on("click", function () {
    var chosen = [];
    $(".carChoice:checked").each(function () { chosen.push($(this).val()); });
    if (chosen.length === 0) {
      alert("يرجى اختيار سيارة واحدة على الأقل قبل المتابعة.");
      return;
    }
    $("#selectedCars").val(chosen.join("، "));
    $("#bookingSection").slideDown(250);
    $("html, body").animate({ scrollTop: $("#bookingSection").offset().top }, 350);
    calculateTotal();
  });

  $("#startDate, #endDate, .carChoice").on("change", function () {
    var chosen = [];
    $(".carChoice:checked").each(function () { chosen.push($(this).val()); });
    $("#selectedCars").val(chosen.join("، "));
    calculateTotal();
  });

  function calculateTotal() {
    var start = $("#startDate").val();
    var end = $("#endDate").val();
    var days = 0;
    if (start && end) {
      var d1 = new Date(start + "T00:00:00");
      var d2 = new Date(end + "T00:00:00");
      days = Math.round((d2 - d1) / 86400000);
    }
    if (days < 1) {
      $("#days, #total, #discount, #finalTotal").val("");
      return;
    }
    var dailySum = 0;
    $(".carChoice:checked").each(function () {
      dailySum += Number($(this).closest("tr").attr("data-price") || 0);
    });
    var total = dailySum * days;
    var discount = days > 10 ? Math.round(total * 0.05) : 0;
    $("#days").val(days);
    $("#total").val(total);
    $("#discount").val(discount);
    $("#finalTotal").val(total - discount);
  }

  $("#bookingForm").on("submit", function (event) {
    event.preventDefault();
    var name = $.trim($("#fullName").val());
    var nationalId = $.trim($("#nationalId").val());
    var start = $("#startDate").val();
    var end = $("#endDate").val();
    var mobile = $.trim($("#mobile").val());
    var email = $.trim($("#email").val());
    var arabicName = /^[\u0600-\u06FF\s]+$/;
    var digits11 = /^[0-9]{11}$/;
    var mobilePattern = /^(09[0-9]{8}|\+?[0-9]{10,15})$/;
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!arabicName.test(name)) { showError("يرجى إدخال الاسم الكامل بأحرف عربية فقط."); return; }
    if (!digits11.test(nationalId)) { showError("الرقم الوطني يجب أن يتكون من 11 رقماً."); return; }
    if (!start || !end) { showError("يرجى إدخال تاريخ البداية والنهاية."); return; }
    if (end <= start) { showError("يجب أن يكون تاريخ النهاية بعد تاريخ البداية."); return; }
    if (!mobilePattern.test(mobile)) { showError("يرجى إدخال رقم موبايل صحيح."); return; }
    if (!emailPattern.test(email)) { showError("يرجى إدخال بريد إلكتروني صحيح."); return; }
    if ($(".carChoice:checked").length === 0) { showError("يرجى اختيار سيارة واحدة على الأقل."); return; }

    calculateTotal();
    if (!$("#days").val()) { showError("تعذر حساب مدة التأجير؛ تحقق من التواريخ."); return; }
    $("#resultMessage").removeClass("error").addClass("success").text(
      "تم التحقق من البيانات بنجاح. مدة التأجير: " + $("#days").val() +
      " يوم/أيام، والمبلغ النهائي: " + $("#finalTotal").val() +
      " ل.س. هذا نموذج تعليمي ولا يرسل البيانات إلى خادم فعلي."
    );
  });

  function showError(message) {
    $("#resultMessage").removeClass("success").addClass("error").text(message);
  }

  $("#saveNote").on("click", function () {
    $("#noteStatus").text("تم تحديث الملاحظة داخل الصفحة الحالية. لا يتم حفظها بعد إغلاق المتصفح.");
  });

  $("#bookingSection").hide();
});