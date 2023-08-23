import { useContext, useState } from 'react';
import { Form } from 'react-router-dom';

import AccountContext from '../../context/AccountContext';



export default function CreateCoA() {

    const { acc, sig } = useContext(AccountContext);

    // immage data
    const [img, setImg] = useState(null);
    const [fileName, setFileName] = useState('No set file name');

    // signature data
    const [iSig, setISig] = useState(null);
    const [iSigName, setISigName] = useState('No issuer signature name');

    // crate an object udated with the data provided {onChange} for metadata
    const [formParams, setFormParams] = useState({

    });

    return (
        <div>
            <h2>Create Certificate</h2>
            <form className='coa-form'>
                <label 
                    className='form-img'
                    onClick={() => document.querySelector('.input-field')}
                >
                    <input type="file" accept='image/*' className='input-field' hidden 
                        onChange={({ target: {files} }) => {
                            files[0] && setFileName(files[0].name)
                            console.log('uploaded img:', files)
                            if(files){
                                console.log('image url:', URL.createObjectURL(files[0]))
                                setImg(URL.createObjectURL(files[0]))
                            }
                        }}
                    />

                    { img ? ( 
                            <img src={img} alt={fileName} />
                        ) : (
                            <p>*uppload image</p>
                    )}
                </label>
                
                {/* --- parameters --- */}
                <div className='form-param'>
                        {/* title */}
                    <div>
                        <label htmlFor='title'>*Work title</label>
                        <input type="text" required name='title' placeholder='artowork title' />
                    </div>
                        {/* artist */}
                    <div>
                        <label htmlFor='artist'>*Artist</label>
                        <input type="text" required name='artist' placeholder='artist name' />
                    </div>
                        {/* date */}
                    <div>
                        <label htmlFor='date'>*Completion</label>
                        <input type="date" required name='date' />
                    </div>
                        {/* dimensions */}
                    <section>
                        <label htmlFor='dimensions'>*Dimensions</label>
                        <div>
                            <label htmlFor="length">*length</label>
                            <input type="number" required name='dimension-length' placeholder='length' />
                        </div>
                        <div>
                            <label htmlFor="heigth">*heigth</label>
                            <input type="number" required name='dimension-heigth' placeholder='heigth' />
                        </div>
                        <div>
                            <label htmlFor="unit">*unit</label>
                            <select type="number" required name='dimension-unit'>
                                <option value="cm">cm</option>
                                <option value="in">in</option>
                            </select>
                        </div>
                    </section>
                        {/* medium */}
                    <div>
                        <label htmlFor="medium">*Medium</label>
                        <input type="text" required name='medium' placeholder='medium' />
                    </div>
                        {/* edition */}
                    <section>
                        <label htmlFor="edition">*Edition</label>
                        <div>
                            <label htmlFor="eddition-type">*type</label>
                            <input type="text" required name='edition' placeholder='edition' />
                        </div>
                        <div>
                            <label htmlFor="eddition-cuantity">cuantity</label>
                            <input type="number" name='cuantity' placeholder='cuantity' />
                        </div>
                        <div>
                            <label htmlFor="eddition-number">number</label>
                            <input type="number" name='number' placeholder='number' />
                        </div>
                    </section>
                </div>
                
                {/* --- statement of auth --- */}
                <div className='form-statement'>
                        <label htmlFor='statement'>*Statement of Authenticity</label>
                        <textarea name='statement' required></textarea>
                </div>
                
                {/* --- authentication fingerprint --- */}
                <div className='form-fingerprint'>
                        <label htmlFor='fingerprint'>*Authentification Fingerprint</label>
                        <textarea name='fingerprint' required></textarea>
                </div>

                {/* --- issuer --- */}
                <div className='form-issuers'>
                    <label htmlFor="issuers">*Issuer</label>
                    <div className='issuer-info'>
                        <label 
                            className='form-signature'
                            onClick={() => document.querySelector('.signature-field')}
                            >
                            <input type="file" accept='image/*' className='signature-field' hidden 
                                onChange={({ target: {files} }) => {
                                    files[0] && setISigName(files[0].name)
                                    console.log('uploaded img:', files)
                                    if(files){
                                        console.log('image url:', URL.createObjectURL(files[0]))
                                        setISig(URL.createObjectURL(files[0]))
                                    }
                                }}
                                />

                            { iSig ? ( 
                                <img src={iSig} alt={iSigName} />
                                ) : (
                                    <p>uppload image</p>
                                    )}
                        </label>
                        <section>
                            <div>
                                <label htmlFor="issuer-name">*Name</label>
                                <input type="text" required name='issuer-name' placeholder='issuer name' />
                            </div>
                            <div>
                                <label htmlFor="issuer-type">*Type</label>
                                <input type="text" required name='issuer-type' placeholder='issuer type'/>
                            </div>
                        </section>
                    </div>
                </div>

                <button onClick={""} >Create Certificate</button>
            </form>
        </div>
    )
}