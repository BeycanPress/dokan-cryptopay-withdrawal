(($) => {

    $(document).ready(() => {
        let CryptoPayApp;
        const modal = $(".dokan-cryptopay-modal");

        $(window).on('click', function(e) {
            if (e.target == modal[0]) {
                modal.hide();
                CryptoPayApp.reset();
            }
        });

        $(document).on('click', '.pay-with-cryptopay', function(e) {
            let key = $(this).data('key');
            let parent = $(this).closest('tr');
            let details = $(this).data('details');
            let currency = DokanCryptoPay.currency;
            let approve = parent.find(".actions .button-group button:eq(0)");
            let amount = parseFloat(parent.find(".amount div").text().replace(/[^a-zA-Z0-9.,]/g, "").trim());
            
            details = {
                address: details.address,
                network: JSON.parse(details.network),
                currency: JSON.parse(details.currency),
            }

            modal.show();

            if (key == 'cryptopay') {
                CryptoPay.networks = [
                    details.network,
                ];

                CryptoPayApp = CryptoPay.startPayment({
                    amount,
                    currency,
                }, {
                    dokanCrytpoPayDetails: details,
                });
    
                CryptoPayApp.events.add('transactionSent', (n, o, tx) => {
                    approve.trigger('click');
                    cpHelpers.successPopup(CryptoPay.lang.transactionSent, `
                        <a href="${tx.getUrl()}" target="_blank">
                            ${CryptoPay.lang.openInExplorer}
                        </a>
                    `).then(() => {
                        modal.hide();
                        CryptoPayApp.reset();
                    });
                });
            } else if (key == 'cryptopay_lite') {
                CryptoPayLite.networks = [
                    details.network,
                ];

                CryptoPayApp = CryptoPayLite.startPayment({
                    amount,
                    currency,
                }, {
                    dokanCrytpoPayDetails: details,
                });
    
                CryptoPayLite.hooks.transactionSent = (n, tx) => {
                    approve.trigger('click');
                    console.log('sa')
                    cpHelpers.successPopup(CryptoPayLite.lang.transactionSent, `
                        <a href="${tx.getUrl()}" target="_blank">
                            ${CryptoPayLite.lang.openInExplorer}
                        </a>
                    `).then(() => {
                        modal.hide();
                        CryptoPayApp.reset();
                    });
                }
            }
            
        });
    });

})(jQuery);